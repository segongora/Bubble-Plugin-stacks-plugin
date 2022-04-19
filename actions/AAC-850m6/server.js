function(properties, context) {

    const auth = require('@stacks/auth');
    const connect = require('@stacks/connect');
    const regeneratorRuntime = require("regenerator-runtime");
    const common = require("@stacks/common");
    const component = require('@loadable/component');
    
    const UserSession = auth.UserSession;
    const AppConfig = auth.AppConfig;
	
    const appDomain = 'https://test-stacks-plugin.bubbleapps.io';
    const authenticatorURL = "https://www.hiro.so/";
	const redirectUri = 'https://test-stacks-plugin.bubbleapps.io/auth';
    const manifestUri = '';
	//const appConfig = new AppConfig(["store_write"], 
    //                  appDomain,redirectUri,manifestUri,"",authenticatorURL);
    const appConfig = new AppConfig(['store_write'], appDomain);
    
	const userSession = new UserSession({ appConfig });

    const transitKey = userSession.generateAndStoreTransitKey();
    
    
    const authRequest = userSession.makeAuthRequest(
  		transitKey,
        undefined,
    	undefined,
    	userSession.appConfig.scopes,
    	undefined,
    	undefined,
    	{
      	undefined,
      	appDetails: {      
        	name: "Todos",      
        	icon: "https://1000marcas.net/wp-content/uploads/2020/02/logo-Google-500x281.png",  
    		},
    	}
	);
    
    const wallet = require('@stacks/wallet-sdk');
    const transactions = require('@stacks/transactions');
    
    const password = properties.password_input;
    const secretKey = properties.secret_key_input;
    
    let create_wallet = context.async(async callback => {
        
        try{
          let new_wallet = await wallet.generateWallet({
              secretKey: secretKey,
              password: password
          });
          callback(null, new_wallet);
            
        }
        catch(err){
          callback(err);
      }});
    
    let restored_wallet = context.async(async callback => {
        
        try{
          	let accounts = await wallet.restoreWalletAccounts({
  				// `baseWallet` is returned from `generateWallet`
  				wallet: create_wallet,
  				gaiaHubUrl: 'https://hub.blockstack.org',
  				network: 'mainnet',
			});
           
          callback(null, accounts);
            
        }
        catch(err){
          callback(err);
      }});
    
    let acc = restored_wallet.accounts[0];
    
    let authResponse = context.async(async callback => {
        
        try{
          let r = 'hola'; 
            /*await wallet.makeAuthResponse({
  				account: acc,
                appDomain: appDomain,
                transitPublicKey: transitKey,
              	scopes: userSession.appConfig.scopes,
  				gaiaHubUrl: 'https://hub.blockstack.org'
			});*/
          callback(null, r);
            
        }
        catch(err){
          callback(err);
      }});

    return {
        transit_key: transitKey,
        auth_request: authRequest
        //auth_response: acc
       
    }


}