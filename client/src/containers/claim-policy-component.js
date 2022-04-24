import { Button, Card, CardContent, FormControl, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 400,
        height: 30,
    },
}));

export const ClaimPolicyComponent = ({ state, policy }) => {
    const classes = useStyles();
    const [formState, setFormState] = useState({

        policyNumber: {
            name: 'policyNumber',
            type: 'text',
            value: '',
            label: 'Policy Number',
            fullWidth: true,
            variant: 'outlined',
            disabled: true,
        },
        area: {
            name: 'area',
            type: 'number',
            label: 'Area in Cents',
            value: '',
            fullWidth: true,
            variant: 'outlined',
            disabled: true
        },

        location: {
            name: 'location',
            type: 'text',
            label: 'Location',
            value: '',
            fullWidth: true,
            variant: 'outlined',
            disabled: true
        },

        policyType: {
            name: 'policyType',
            type: 'select',
            options: [{ value: 'Flood', text: 'Covers Flood' },
            { value: 'Drought', text: 'Covers Drought' }],
            value: 'Flood',
            label: 'Policy Type',
            fullWidth: true,
            variant: 'outlined',
            disabled: true,

        },

        coverageAmount: {
            name: 'coverageAmount',
            type: 'number',
            disabled: true,
            fullWidth: true,
            label: 'Coverage Amount (ETH)',
            variant: 'outlined',
            value: 0
        },
        date: {
            name: 'date',
            type: 'date',
            disabled: false,
            fullWidth: true,
            label: 'Date',
            inputVariant: 'outlined',
            value: new Date(),
            autoOk: true,
            // disableFuture: true,
        }

    });
    const [trxStatus, setTrxStatus] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        bindFormHandlersToState();
        populatePolicy();
    }, []);

    const populatePolicy = () => {
        updateFormElementState('policyNumber', 'value', `DAINSURE${policy.policyNumber}`);
        updateFormElementState('coverageAmount', 'value', policy.coverageAmount);
        updateFormElementState('policyType', 'value', policy.pType);
        updateFormElementState('location', 'value', policy.location);
        updateFormElementState('area', 'value', policy.landAreaInCents);

    }

    const onChangeHandler = (event) => {
        const { target } = event;
        const { name, value } = target;
        updateFormElementState(name, 'value', value);

    }

    const updateFormElementState = (name, property, value) => {
        setFormState(prevState => {
            const element = prevState[name];
            return {
                ...prevState,
                [name]: {
                    ...element,
                    [property]: value
                }
            }
        })
    }

    const bindFormHandlersToState = () => {
        setFormState((prevState) => {
            const newFormState = {};
            Object.keys(prevState).forEach(key => {
                newFormState[key] = { ...formState[key], onChange: onChangeHandler };
                if (key === 'date') {
                    newFormState[key] = {
                        ...formState[key], onChange: (value) => onChangeHandler(
                            {
                                target: {
                                    name: key, value
                                }
                            }
                        )
                    };
                }

            })

            return newFormState;
        })
    }

    const claimHandler = async () => {
        const { contract, web3, accounts } = state;
        contract.methods.claim(+policy.policyNumber).send({
            from: accounts[0],
            gas: 650000
        }).then(success => {
            setTrxStatus("CREATED");
            setTimeout(() => navigate('/view-policies'), 2000);
        }).catch(e => {
            console.log(e);
            setTrxStatus("FAILED");
        })
    }


    return <>
        <Card>
            <CardContent>
                <Grid container alignItems="center" justify="center" direction="column" spacing={3}>
                    <Grid item>
                        {trxStatus === 'FAILED' && <Alert severity='error'>Insurance Claim Failed</Alert>}
                        {trxStatus === 'CREATED' && <Alert severity='success'>Insurance Claimed Successfully!!</Alert>}
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Claim Policy</Typography>
                    </Grid>
                    <Grid item >
                        <FormControl variant="outlined" className={classes.formControl}>

                            <TextField

                                {...formState['policyNumber']}
                            >
                            </TextField>
                        </FormControl>

                    </Grid>
                    <Grid item >
                        <FormControl variant="outlined" className={classes.formControl}>

                            <TextField

                                {...formState['area']}
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

                                {...formState['coverageAmount']}
                            >
                            </TextField>
                        </FormControl>

                    </Grid>
                    <Grid item >
                        <FormControl variant="outlined" className={classes.formControl}>

                            <TextField

                                {...formState['policyType']}
                            >
                            </TextField>
                        </FormControl>

                    </Grid>
                    <Grid item >
                        <FormControl variant="outlined" className={classes.formControl}>

                            <KeyboardDatePicker

                                    name="date"
                                    fullWidth
                                    onChange={(value) => onChangeHandler({ target: { name: 'date', value } })}
                                    error={formState['date'].error}
                                    helperText={formState['date'].helperText}
                                    value={formState['date'].value}
                                    label="Date"
                                    format="DD/MM/yyyy"
                                    disableFuture
                                    autoOk
                                    // minDate={new Date()}
                                    // minDateMessage={'Choose the Future Date'}
                                    invalidDateMessage={'Invalid Date'}
                                    inputVariant= "outlined"
                                    >
                                    </KeyboardDatePicker>

                        </FormControl>

                    </Grid>
                    <Grid item >
                        <Button color="primary" variant='contained' onClick={claimHandler}>Claim</Button>

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
}