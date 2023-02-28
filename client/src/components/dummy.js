useEffect(() => {
    const Total =async ()=> {
    var arr = document.getElementsByName("amount");
    var totalPrice = 0;
    arr.forEach(a=> {
        if(a.value) {
            totalPrice += +a.value;
        }})
        
        setTotalAmount(totalPrice)
        

    }


Total();

}, [invoiceData]);


const data= new FormData();
data.append("invoiceData",invoiceData);
data.append("file",invoiceData);