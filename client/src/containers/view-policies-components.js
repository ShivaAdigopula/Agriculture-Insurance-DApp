import { Button, Card, CardContent, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ClaimPolicyComponent } from './claim-policy-component';
import _ from 'lodash';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

export const ViewPolicyComponent = ({ state }) => {
    const classes = useStyles();
    const [myPolicies, setMyPolicies] = useState([]);
    const [policyToClaim, setPolicyToClaim] = useState({});

    const policyStatusMap = {
        0: 'PENDING',
        1 :'ACTIVE',
        2: 'EXPIRED',
        3: 'CLAIMED',
        4: 'CANCELLED'
    }

    useEffect(() => {
        getUserPolicies();
    }, [])


    const getUserPolicies = async () => {
        const { accounts, contract = {} } = state;


        const response = await contract.methods.getUserPolicies(accounts[0]).call();
        response.forEach(getPolicy)
        console.table(response);
    };

    const getPolicy = async policyNumber => {
        const { accounts, contract = {} } = state;
        const policy = await contract.methods.policies(policyNumber).call();
        setMyPolicies(prevState => {
            return [...prevState, policy]
        });
    }

    const proceedToClaimPolicy = (policy) => {
        setPolicyToClaim(policy);
    }


    return <>
        <Card className='new-policy-form'>
            <CardContent>
                <Grid cotainer>
                    <Grid item>
                        <Typography variant="h6">Your Policies</Typography>
                    </Grid>
                    <Grid item>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Policy Number</TableCell>
                                        <TableCell align="right">Season</TableCell>
                                        <TableCell align="right">Crop Name</TableCell>
                                        <TableCell align="right">Policy Start Date</TableCell>
                                        <TableCell align="right">Policy End Date</TableCell>
                                        <TableCell align="right">Area in Cents</TableCell>
                                        <TableCell align="right">Policy Coverage Amount</TableCell>
                                        <TableCell align="right">Policy Type</TableCell>
                                        <TableCell align="right">Policy Location</TableCell>
                                        <TableCell align="right">Policy Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {myPolicies.map((policy) => (
                                        <TableRow key={policy.policyNumber}>
                                            <TableCell component="th" scope="row">
                                                {`DAINSURE${policy.policyNumber}`}
                                            </TableCell>
                                            <TableCell align="right">{policy.season}</TableCell>
                                            <TableCell align="right">{policy.cropName}</TableCell>
                                            <TableCell align="right">{new Date(policy.startTime*1000).toLocaleDateString('en-US')}</TableCell>
                                            <TableCell align="right">{new Date(policy.endTime*1000).toLocaleDateString('en-US')}</TableCell>
                                            <TableCell align="right">{`${policy.landAreaInCents}`}</TableCell>
                                            <TableCell align="right">{`${policy.coverageAmount} ETH`}</TableCell>
                                            <TableCell align="right">{policy.pType}</TableCell>
                                            <TableCell align="right">{policy.location}</TableCell>
                                            <TableCell align="right">{policyStatusMap[policy.status]}</TableCell>
                                            <TableCell align="right">{policy.status == 1 && <Button color="primary" variant="outlined" onClick={() => proceedToClaimPolicy(policy)}>Claim</Button>   }</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </CardContent>


            
        </Card>

        {!_.isEmpty(policyToClaim) && <ClaimPolicyComponent state={state} policy={policyToClaim} />}

    </>
}