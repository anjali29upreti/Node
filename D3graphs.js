
const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({  
 input: fs.createReadStream('Indicators.csv')
});
/*var jsonFile=[];*/
storeTemp = [];
storeTemp2 = [];

var valueM=0;
var valueF=0;
var tmpy=0;
var year=1960;
var DRate;
var Year;
var BRate;
var highExpectArr =[];
var flag=0;
/*var year = 1960*/;
 var Countries=["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India", "Indonesia", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal",
   "Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"];
rl.on('line', (line) => {
    var spliting = line.split(',');


            if(spliting[4] == 'SP.DYN.LE00.IN')
                {
                    var objHighExpect ={};
                    objHighExpect.Country = spliting[0];
                    objHighExpect.Value = spliting[6];
                    objHighExpect.Count = 1;
                     for(i=0;i<highExpectArr.length;i++){
                            if(highExpectArr[i].Country===spliting[0]){
                                  highExpectArr[i].Value=parseFloat(spliting[6])+parseFloat(highExpectArr[i].Value);
                                  flag++;
                                  highExpectArr[i].Count=parseInt(highExpectArr[i].Count)+1;
                                                     }
                     }

                     if(flag==0){
                      highExpectArr.push(objHighExpect);
                  }

               }


            if(Countries.indexOf(spliting[0])!=-1)
            {

                if(spliting[0] == 'India' && (spliting[5] == 'SP.DYN.CBRT.IN' || spliting[5] == 'SP.DYN.CDRT.IN' ))
                 {
                      
                        var objIndia = {};

                        year=spliting[6];
                        if(year == tmpy){

                              objIndia.Year=Year;
                         objIndia.BRate=parseFloat(BRate);
                         
                         

                          if(spliting[5] == 'SP.DYN.CDRT.IN')
                         {
                             DRate = spliting[7];
                            
                         }
                         objIndia.DRate=parseFloat(DRate);

                         storeTemp2.push(objIndia);
                    }

                    else{
                        tmpy=year;
                        Year=tmpy;
                        if(spliting[5] == 'SP.DYN.CBRT.IN')
                           {
                            
                              BRate = spliting[7];
                            
                           }
                       
                          
                         
                    }       

                 }
            
                if(spliting[4]=='SP.DYN.LE00.FE.IN' || spliting[4]=='SP.DYN.LE00.MA.IN')
                {   
                     var tmpObject = {};
                     tmpObject.CountryName = spliting[0];
                
                     if(spliting[4]=='SP.DYN.LE00.FE.IN'){
                         tmpObject.IndicatorName= 'Female';
                        }
                    else if(spliting[4] == 'SP.DYN.LE00.MA.IN'){
                        tmpObject.IndicatorName='Male';
                        }
                    tmpObject.Value = spliting[6];
                    tmpObject.Year = spliting[5];
                    if(year == tmpObject.Year)
                    {
                        if(tmpObject.IndicatorName == 'Male')
                        {
                            valueM = parseFloat(valueM) + parseFloat(tmpObject.Value);
                        }
                        if(tmpObject.IndicatorName == 'Female')
                        {
                            valueF = parseFloat(valueF) + parseFloat(tmpObject.Value);
                        }
                    }
                    else{
                        
                        var finalObject = {};
                        finalObject.Year=year;
                        finalObject.ValueM= valueM;
                        finalObject.ValueF = valueF;
                        valueM=0;
                        valueF=parseFloat(tmpObject.Value);
                        year=tmpObject.Year;
                        storeTemp.push(finalObject);
                    }
                    
                    
              
                 }


            }
            
   
}); 
    rl.on('close',()=>{
        if(storeTemp !== undefined) 
            {
                fs.writeFileSync('GraphPlot.json',JSON.stringify(storeTemp));

            }
        if(storeTemp2 !== undefined) 
            {
                fs.writeFileSync('IndiaGraphPlot.json',JSON.stringify(storeTemp2));

            }

            for (var i = 0; i < highExpectArr.length; i++) {
                     highExpectArr[i].Value=parseInt(highExpectArr[i].Value)/parseInt(highExpectArr[i].Count);
                    delete highExpectArr[i].Count;
                    }
                highExpectArr.sort(function(b,a) {
                        if (a.Value < b.Value)
                        return -1;
                        if (a.Value > b.Value)
                        return 1;
                        return 0;
                });
                highExpectArr.splice(5);
                fs.writeFileSync('LifeExpectancyGraph.json',JSON.stringify(highExpectArr));

    })
        