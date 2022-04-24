import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CropInsuranceContract from "./contracts/CropInsurance.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import { NewPolicyComponent } from "./containers/new-policy-component";
import { Grid } from "@material-ui/core";
import { Route, Routes } from "react-router-dom";
import { ViewPolicyComponent } from "./containers/view-policies-components";
import { AppBarComponent } from "./components/app-bar-component";
import { ClaimPolicyComponent } from "./containers/claim-policy-component";

class App extends Component {
  state = { cropTypeDetails: [], web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CropInsuranceContract.networks[networkId];
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(
          CropInsuranceContract.abi,
          deployedNetwork.address,
        );
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance }, this.getCropTypeDetails);
      }


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getCropTypeDetails = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    const KARIF = await contract.methods.cropTypeDetails(0).call();
    const RABI = await contract.methods.cropTypeDetails(1).call();
    const ZAID = await contract.methods.cropTypeDetails(2).call();



    // Update state with the result.
    this.setState({ cropTypeDetails: [KARIF, RABI, ZAID] });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (<>
      <AppBarComponent />
      <Grid container alignItems="center" justify="center" direction="column">

        <Routes>

          <Route path="/" element={<NewPolicyComponent state={this.state} />} />
          <Route path="/view-policies" element={<ViewPolicyComponent state={this.state} />} />
          <Route path="/claim-policy" element={<ClaimPolicyComponent state={this.state} />} />
        </Routes>

      </Grid>
    </>

    );
  }
}

export default App;
