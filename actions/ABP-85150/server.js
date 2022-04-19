function(properties, context) {

	const wallet = require('@stacks/wallet-sdk');
    const transaction = require('@stacks/transactions');
    const fs = require('fs');
    
    const password = properties.password_input;
    const secretKey = properties.secret_key_input;
    const contractName = properties.contract_name;
    const codeBodyFile = properties.code_body_file;
    
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
        
    let privateKey = context.async(async callback => {
        
        try{
          	let pvtKey = await restored_wallet.accounts[0].stxPrivateKey;
           
          callback(null, pvtKey);
            
        }
        catch(err){
          callback(err);
      }});
    
    const txOptions = {
  		contractName: contractName,
  		codeBody: fs.readFileSync(codeBodyFile).toString(),
  		senderKey: privateKey,
  		network: 'mainnet',
  		anchorMode: transaction.AnchorMode.Any,
	};
    
    let trans = context.async(async callback => {
        
        try{
          let TransactionToken = await transaction.makeContractDeploy(txOptions);
          callback(null, TransactionToken);
            
        }
        catch(err){
          callback(err);
      }});
    
    let broadcastResponse = context.async(async callback => {
        
        try{
          let broad = await transaction.broadcastTransaction(trans,'mainnet');
          callback(null, broad);
            
        }
        catch(err){
          callback(err);
      }});
    
	const txId = broadcastResponse.txid; 
    
    return {
        broadcast_response: txId
    }

}