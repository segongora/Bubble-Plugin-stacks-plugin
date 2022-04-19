function(instance, properties, context) {

    
    
    const authRequest = properties.some_key;
    const provider = window.StacksProvider;

    const authResponse = context.async(async callback => {
        try {
            	await setTimeout(() => {
                    console.log(authRequest);
                    let response = provider.authenticationRequest(authRequest);  
         			callback(null, response);
                    console.log(response);
                    
                }, 5000);
        	  } catch (err) {
            	callback(err)
        	  }
    });
    

    


}