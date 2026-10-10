
document.addEventListener("DOMContentLoaded",()=>{
 const status=document.querySelector("#trackingStatus");
 if(status){const steps=["Order Confirmed","Packed","Shipped","Out for Delivery","Delivered"];status.innerHTML=steps.map((s,i)=>`<div class="step ${i<3?"done":""}"><strong>${s}</strong><p>${i<3?"Completed":"Pending"}</p></div>`).join("")}
});
