# Decentralized Agriculture Insurance Solution


## Installation



1. you can install Truffle globally and run the `unbox` command.
    ```javascript
    npm install -g truffle
   
    ```

2. Run the development console.
    ```javascript
    truffle develop
    ```

3. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

4. In the `client` directory, we run the React app. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // in another terminal (i.e. not in the truffle develop prompt)
    cd client
    npm run start
    ```

5. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    // inside the development console.
    test

    // outside the development console..
    truffle test
    ```

6. Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.
    ```javascript
    // ensure you are inside the client directory when running this
    npm run test
    ```

7. To build the application for production, use the build script. A production build will be in the `client/build` folder.
    ```javascript
    // ensure you are inside the client directory when running this
    npm run build
    ```

## FAQ

* __How do I use this with the Ganache-CLI?__

    It's as easy as modifying the config file! [Check out our documentation on adding network configurations](http://truffleframework.com/docs/advanced/configuration#networks). Depending on the port you're using, you'll also need to update line 29 of `client/src/utils/getWeb3.js`.

* __Where is my production build?__

    The production build will be in the `client/build` folder after running `npm run build` in the `client` folder.

* __Where can I find more documentation?__

    This box is a marriage of [Truffle](http://truffleframework.com/) and a React setup created with [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md). Either one would be a great place to start!




## Notes

    Major Crop Seasons in India 
    1. Rabi (June-July) -> Monsoon Crop -> harvested in Sept - Oct -> Requires hot weather and lot of water
        Example: Rice, Maize, Cotton, GroundNut, Sugarcane, Turmeric
    2. Kharif (Oct - Nov) -> Harvested in April-May -> Required warm climate for germintion of seads
       Example: Wheat, Oat, Pea, Tomato, Onion, Oil Seeds

    3. Zaid (March - June) -> Early maturing crops
       Example: Cucumber , Bitter Gourd, Pumpkin
https://testbook.com/blog/crops-in-india-gk-notes-pdf/
