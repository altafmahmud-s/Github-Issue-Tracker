
//  loging page takai home page ai jaior jonn function 

document.getElementById("login-btn").addEventListener("click",function()
{
    // console.log("login butto clicked");
    // 1.get the mobile number input
    const nameInput = document.getElementById("input-text");
    const contactName = nameInput.value;
    console.log(contactName);
    // 2.get the pin input
    const pinInput = document.getElementById("input-pin");
    const pinNumber = pinInput.value;
    console.log(pinNumber);
    // 3.mach the pin & mobile number
    if(contactName == "admin" && pinNumber=="admin123"){
        // 3.1 true:::>> alert> homepage
        alert("login Success");
        // window.location.assign("home.html");
        window.location.href = "home.html";
    }
    else{
        // 3.2 false:::>> alert> return
        alert("login Failed");
        return;

    }
});



