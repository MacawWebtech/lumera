
const KEY="lumera-cart";
const load=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
function addCart(name,price,img){
 const c=load(), hit=c.find(x=>x.name===name); hit?hit.qty++:c.push({name,price:+price,img,qty:1}); save(c); showToast("Added to cart");
}
function addWish(name){let w=JSON.parse(localStorage.getItem("lumera-wishlist")||"[]"); if(!w.includes(name))w.push(name);localStorage.setItem("lumera-wishlist",JSON.stringify(w));showToast("Saved to wishlist")}
document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll("[data-add-cart]").forEach(b=>b.addEventListener("click",()=>addCart(b.dataset.name,b.dataset.price,b.dataset.img)));
 document.querySelectorAll("[data-wish]").forEach(b=>b.addEventListener("click",()=>addWish(b.dataset.name)));
 const box=document.querySelector("#cartItems"); if(!box)return;
 const render=()=>{const c=load();box.innerHTML=c.length?c.map((x,i)=>`<div class="cart-item"><img src="${x.img}" alt="${x.name}"><div><strong>${x.name}</strong><div>$${x.price.toFixed(2)}</div><button class="btn btn-light" data-remove="${i}">Remove</button></div><div class="qty"><button data-dec="${i}">−</button><span>${x.qty}</span><button data-inc="${i}">+</button></div></div>`).join(""):`<div class="notice">Your cart is empty.</div>`; const total=c.reduce((s,x)=>s+x.price*x.qty,0); const t=document.querySelector("#cartTotal"); if(t)t.textContent="$"+total.toFixed(2);
 box.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{c[b.dataset.inc].qty++;save(c);render()});
 box.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{let x=c[b.dataset.dec];x.qty--;if(x.qty<=0)c.splice(b.dataset.dec,1);save(c);render()});
 box.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{c.splice(b.dataset.remove,1);save(c);render()});
 }; render();
});
