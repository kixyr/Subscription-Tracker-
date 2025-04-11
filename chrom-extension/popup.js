      let isCsv = false

      console.log('yyyyyyy')
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
        if(request.csv) isCsv=true
        console.log('gagqaherqaerhae')
        console.log(request.csv)
        console.log('looooooooo')
      })
      document.getElementById('upload-btn').addEventListener('click', async (e) =>{
      e.preventDefault()
      chrome.storage.local.get('isCsv', (data) =>{
        if(!data.isCsv){
          console.log('errr')
          return error.innerHTML = "file not csv"
        }
        const csvFile = document.getElementById('fileInput').files[0]
        chrome.storage.local.get('downloadTime', async (data) =>{
           const  downloadTime = data.downloadTime
          const error = document.getElementById('error')
          const form = new FormData()
          form.append('file',csvFile)
          form.append('downloadTime', downloadTime)
        
      
          error.innerHTML = "file sent"
          try{ await fetch("http://localhost:5000/api/v1/csv" , 
            { method: "POST", body: form }
            
          )
          console.log('sucesss')
          console.log(csvFile)}
          
          catch(error){
            console.log(error)
          }
      })
     
        })
        
       
      
      
      })