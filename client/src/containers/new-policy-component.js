import React, { useEffect, useState } from 'react';
import { Grid, FormControl, Select, InputLabel, MenuItem, Card, makeStyles, Typography, CardHeader, CardContent, TextField, Button } from '@material-ui/core';
import BigNumber from "bignumber.js";
import Alert from '@material-ui/lab/Alert';
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
      height:30,
    },
  }));

export const NewPolicyComponent = ({state}) => {
    const classes = useStyles();
    const [formState, setFormState] = useState({
        season: {
            name: 'season',
            type: 'select',
            options: [{
                value: 0, text: 'Karif',
            }, {
                value: 1, text: 'Rabi',
            }, {
                value: 2, text: 'Zaid',
            }],
            value: 0,
            label: 'Crop Season',
            fullWidth:true,
            variant: 'outlined'
        },
        location: {
            name: 'location',
            type: 'text',
            value: '',
            label: 'Location',
            fullWidth:true,
            variant: 'outlined'
        },
        crop: {
            name: 'crop',
            type: 'text',
            value: '',
            label: 'Crop Name',
            fullWidth:true,
            variant: 'outlined'
        },
        area: {
            name: 'area',
            type: 'number',
            label: 'Area in Cents',
            value: '',
            fullWidth:true,
            variant: 'outlined'
        },
        policyType: {
            name: 'policyType',
            type: 'select',
            options: [{ value: 'Flood', text: 'Covers Flood' },
            { value: 'Drought', text: 'Covers Drought' }],
            value: 'Flood',
            label: 'Policy Type',
            fullWidth:true,
            variant: 'outlined'

        },
        premiumToPay: {
            name: 'premiumToPay',
            type: 'number',
            disabled: true,
            fullWidth:true,
            label: 'Total Premium to Pay (ETH)',
            variant: 'outlined',
            value: 0
        },
        coverageAmount: {
            name: 'coverageAmount',
            type: 'number',
            disabled: true,
            fullWidth:true,
            label: 'Coverage Amount (ETH)',
            variant: 'outlined',
            value: 0
        }

    });
    const [formDirty, setFormDirty] = useState(false);
    const [readyToPay, setReadyToPay] = useState(false);
    const [trxStatus, setTrxStatus] = useState('');

    useEffect(() => {
        bindFormHandlersToState();
    }, []);

    const onChangeHandler = (event) => {
        const {target} = event;
        const {name, value} = target;
        updateFormElementState(name, 'value', value);
        setFormDirty(true);
    }

    const updateFormElementState = (name, property, value) => {
            setFormState(prevState => {
                const element = prevState[name];
                return {
                    ...prevState,
                    [name] : {
                        ...element,
                        [property] : value
                    }
                }
            })
    }

    const bindFormHandlersToState = () => {
            setFormState((prevState) => {
                const newFormState = {};
                Object.keys(prevState).forEach(key => {
                    newFormState[key] = {...formState[key], onChange: onChangeHandler};
                })

                return newFormState;
            })
    }

    const calculatePremium = async () => {
        const {cropTypeDetails} = state;
        const season = (+formState['season'].value);
        const areaInCents = (+formState['area'].value);
        
        const cropDetail = cropTypeDetails[season];
        const premiumToPay =   new BigNumber(cropDetail.premiumPerCent)
        .dividedBy(new BigNumber(10).exponentiatedBy(18))
        .toFixed() * areaInCents;

        const coverageAmount =   new BigNumber(cropDetail.coveragePerCent)
        .dividedBy(new BigNumber(10).exponentiatedBy(18))
        .toFixed() * areaInCents;

        updateFormElementState('premiumToPay', 'value', premiumToPay);
        updateFormElementState('coverageAmount', 'value', coverageAmount);
        setFormDirty(false);
        setReadyToPay(true);

    }

    const buyPolicy =  () => {
        const {contract, web3, accounts, cropTypeDetails} = state;
        const season = (+formState['season'].value);
        const crop = formState['crop'].value;
        const areaInCents = (+formState['area'].value);
        const location = formState['location'].value;
        const type = formState['policyType'].value ;
        const coverageAmount = (+formState['coverageAmount'].value);
        const amountToPay = (+formState['premiumToPay'].value);

        
        console.log({season, crop, areaInCents, location, type, coverageAmount, amountToPay});

         contract.methods.buyPolicy(season,crop, location, type, areaInCents,  coverageAmount).send({
            from: accounts[0],
            value:web3.utils.toWei(String(amountToPay), 'ether'),
            gas: 650000
        }).then(success => {
            setTrxStatus("CREATED");
        }).catch(e => {
            console.log(e);
            setTrxStatus("FAILED");
        })

    }



    return <>
        <Card className='new-policy-form'>

            
            <CardContent>
           
            <Grid container alignItems="center" justify="center" direction="column" spacing={3}>
                <Grid item>
                    {trxStatus === 'FAILED' && <Alert severity="error">Transaction failed !! Please re-apply</Alert>}
                    {trxStatus === 'CREATED' && <Alert severity="success">Policy Created ..!! view your policy in 'My Policies' section </Alert>}
                </Grid>
                <Grid item>
                <Typography variant="h6">New Policy</Typography>
                </Grid>
                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="seasonInputLabel">{formState['season'].label}</InputLabel>
                        <Select
                            {...formState['season']}
                        >
                            {formState['season'].options.map(option => {
                                return <MenuItem value={option.value}>
                               {option.text}
                            </MenuItem>
                            
                            })}
                        </Select>
                    </FormControl>

                </Grid>
                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                      
                        <TextField
                            
                            {...formState['crop']}
                        >
                        </TextField>
                    </FormControl>
                    
                </Grid>
                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                      
                        <TextField
                            
                            {...formState['location']}
                        >
                        </TextField>
                    </FormControl>
                    
                </Grid>
                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                      
                        <TextField
                            
                            
                            {...formState['area'] }
                        >
                        </TextField>
                    </FormControl>
                    
                </Grid>
                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="policyTypeLabel">{formState['policyType'].label}</InputLabel>
                        <Select
                            
                            {...formState['policyType']}
                        >
                             {formState['policyType'].options.map(option => {
                                return <MenuItem value={option.value}>
                               {option.text}
                            </MenuItem>
                            
                            })}
                        </Select>
                    </FormControl>
                    
                </Grid>

                <Grid item >
                    <Button color="primary" variant="contained" disabled={!formDirty} onClick={calculatePremium}>Calculate Premium Amount</Button>
                    
                </Grid>

                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                      
                        <TextField
                            
                            {...formState['premiumToPay']}
                        >
                        </TextField>
                    </FormControl>
                    
                </Grid>
                <Grid item >
                    <FormControl variant="outlined" className={classes.formControl}>
                      
                        <TextField
                            
                            {...formState['coverageAmount']}
                        >
                        </TextField>
                    </FormControl>
                    
                </Grid>
                <Grid item >
                    <Button color="primary" variant="contained" disabled={!readyToPay || trxStatus === 'CREATED'} onClick={buyPolicy}>Buy Policy</Button>
                    
                </Grid>
                
            </Grid>
            </CardContent>
        </Card>

    </>
}