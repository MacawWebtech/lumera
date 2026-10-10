
(() => {
 const html=document.documentElement;
 const saved=localStorage.getItem("lumera-theme");
 if(saved){html.dataset.theme=saved}else if(matchMedia("(prefers-color-scheme: dark)").matches){html.dataset.theme="dark"}
 document.querySelectorAll("[data-theme-toggle]").forEach(b=>b.addEventListener("click",()=>{
   const next=html.dataset.theme==="dark"?"light":"dark"; html.dataset.theme=next; localStorage.setItem("lumera-theme",next);
 }));
 document.querySelectorAll("[data-rtl-toggle]").forEach(b=>b.addEventListener("click",()=>{
   html.dir=html.dir==="rtl"?"ltr":"rtl";
   localStorage.setItem("lumera-dir",html.dir);
   document.querySelectorAll("[data-rtl-toggle]").forEach(btn=>{
     btn.setAttribute("aria-label", html.dir==="rtl" ? "Switch to LTR layout" : "Switch to RTL layout");
     btn.title = html.dir==="rtl" ? "LTR layout" : "RTL layout";
   });
 }));
 const dir=localStorage.getItem("lumera-dir"); if(dir) html.dir=dir;
 document.querySelectorAll("[data-rtl-toggle]").forEach(btn=>{
   btn.setAttribute("aria-label", html.dir==="rtl" ? "Switch to LTR layout" : "Switch to RTL layout");
   btn.title = html.dir==="rtl" ? "LTR layout" : "RTL layout";
 });
 const currentPage=(location.pathname.split("/").pop()||"index.html").split("?")[0].split("#")[0] || "index.html";
 document.querySelectorAll(".desktop-nav a,.mobile-links a").forEach(link=>{
   const href=(link.getAttribute("href")||"").split("#")[0].split("?")[0];
   const page=href || "index.html";
   if(page===currentPage){
     link.classList.add("active");
     link.setAttribute("aria-current","page");
   }
 });
 document.querySelectorAll(".nav-dropdown").forEach(dropdown=>{
   if(dropdown.querySelector(".nav-dropdown-menu a.active")){
     dropdown.querySelector(":scope > button")?.classList.add("active");
   }
 });
 const menu=document.querySelector("[data-mobile-panel]");
 const menuButtons=[...document.querySelectorAll("[data-menu-toggle]")];
 const setMenuState=(open)=>{
   if(!menu) return;
   menu.classList.toggle("open",open);
   menuButtons.forEach(btn=>btn.setAttribute("aria-expanded",String(open)));
 };
 menuButtons.forEach(btn=>{
   btn.setAttribute("aria-expanded",menu?.classList.contains("open")?"true":"false");
   btn.addEventListener("click",()=>setMenuState(!menu?.classList.contains("open")));
 });
 menu?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>setMenuState(false)));
 addEventListener("resize",()=>{if(innerWidth>1024)setMenuState(false)},{passive:true});
 addEventListener("keydown",e=>{if(e.key==="Escape")setMenuState(false)});
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.08});
 document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
 document.querySelectorAll(".accordion-btn").forEach(btn=>btn.addEventListener("click",()=>{
   const item=btn.closest(".accordion-itemx"); item.classList.toggle("open"); btn.setAttribute("aria-expanded",item.classList.contains("open"));
 }));
 document.querySelectorAll("form[data-demo-form]").forEach(f=>f.addEventListener("submit",e=>{
   e.preventDefault();
   if(!f.checkValidity()){
     f.reportValidity();
     const bad=f.querySelector(":invalid");
     bad?.focus();
     showToast("Please complete the required fields.");
     return;
   }
   f.reset(); showToast("Thanks — this front-end demo form is ready for integration.");
 }));
 window.showToast=(msg)=>{let t=document.querySelector(".toastx"); if(!t){t=document.createElement("div");t.className="toastx";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
})();


// Premium motion system
(() => {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  };
  addEventListener("scroll", updateProgress, {passive:true});
  addEventListener("resize", updateProgress);
  updateProgress();

  const targets = document.querySelectorAll(
    ".motion-fade,.motion-up,.motion-left,.motion-right,.motion-scale,[data-stagger]"
  );
  const motionIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-in");
        motionIO.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:"0px 0px -5% 0px"});
  targets.forEach(el => motionIO.observe(el));

  if(matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.querySelectorAll("[data-cursor-lift]").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX-r.left)/r.width-.5)*8;
        const y = ((e.clientY-r.top)/r.height-.5)*8;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener("mouseleave",()=>el.style.transform="");
    });
  }

  document.querySelectorAll(".category-tab").forEach(btn=>{
    btn.addEventListener("click",()=>{
      btn.closest(".category-tabs")?.querySelectorAll(".category-tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
})();


// Premium reveal system
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll("[data-reveal], [data-stagger]");
  if (reduce) {
    revealTargets.forEach(el => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  const mediaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-revealed");
        mediaObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.18});
  document.querySelectorAll(".hero-media,.split-media").forEach(el => mediaObserver.observe(el));

  // Home 1 Bestsellers: keep one category tab row and make each tab filter the products.
  document.querySelectorAll("#bestsellers .tabs-row").forEach((row, index) => {
    if(index > 0) row.remove();
  });
  const bestsellerTabs = document.querySelectorAll("#bestsellers [data-product-tab]");
  const bestsellerProducts = document.querySelectorAll("#bestsellers [data-home-product]");
  const showBestsellerCategory = (category, activeTab) => {
    bestsellerTabs.forEach(tab => {
      const active = tab === activeTab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    bestsellerProducts.forEach(card => {
      const matches = category === "all" || card.dataset.category === category;
      card.hidden = !matches;
    });
  };
  bestsellerTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      showBestsellerCategory(btn.dataset.productTab, btn);
    });
  });
  // Start with all bestseller products visible. Clicking a category shows only that category's product.
  const initialBestsellerTab = document.querySelector('#bestsellers [data-product-tab="all"]');
  if(initialBestsellerTab) showBestsellerCategory("all", initialBestsellerTab);

  const finder = document.querySelector("#routineFinder");
  if(finder){
    finder.addEventListener("submit", e => {
      e.preventDefault();
      const concern = finder.querySelector("[name=concern]")?.value || "your concern";
      const skin = finder.querySelector("[name=skin]")?.value || "your skin type";
      showToast(`Routine direction ready for ${skin} + ${concern}.`);
    });
  }
})();


// Education routine switcher + divider reveal
(() => {
  document.querySelectorAll("[data-routine-target]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id=btn.dataset.routineTarget;
      const wrap=btn.closest(".routine-switcher");
      if(!wrap) return;
      wrap.querySelectorAll("[data-routine-target]").forEach(x=>x.classList.toggle("active",x===btn));
      wrap.querySelectorAll(".routine-panel").forEach(panel=>panel.classList.toggle("active",panel.id===id));
    });
  });

  const lineObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        lineObserver.unobserve(entry.target);
      }
    });
  },{threshold:.4});
  document.querySelectorAll("[data-reveal-line]").forEach(el=>lineObserver.observe(el));
})();
