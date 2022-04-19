function(properties, context) {


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
    
    const new_account = wallet.generateNewAccount(restored_wallet);
    
    let acc = new_account.accounts[new_account.accounts.length-1];   
    
    let accounts_list = [];
    
    let account = context.async(async callback => {
        try {
            	await setTimeout(() => {
                    
                    let r = transactions.getAddressFromPrivateKey(
        				acc.stxPrivateKey,
        				transactions.TransactionVersion.Mainnet 	
    				);
                    for(let i=0;i<new_account.accounts.length;i++){
        				//accounts_list.push(restored_wallet.accounts[i].stxPrivateKey);
                        accounts_list.push(
                        	transactions.getAddressFromPrivateKey(
        					new_account.accounts[i].stxPrivateKey,
        					transactions.TransactionVersion.Mainnet 	
    						)
                        );
    				}
            		callback(null, r);
        		  }, 1000)
        	  } catch (err) {
            	callback(err)
        	  }
    });
    
    
    
    
    return {
        account: account,
        accounts_list: accounts_list
    }




}