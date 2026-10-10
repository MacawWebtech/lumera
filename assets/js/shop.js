
document.addEventListener("DOMContentLoaded",()=>{
  const grid=document.querySelector("#productGrid");
  if(!grid) return;

  const search=document.querySelector("#productSearch");
  const sort=document.querySelector("#sortProducts");
  const countEl=document.querySelector("#visibleProductCount");
  const chipWrap=document.querySelector("#activeFilterChips");
  const clearAll=document.querySelector("#clearAllFilters");
  const clearMobile=document.querySelector("#clearFiltersMobile");
  const activeCount=document.querySelector("#activeFilterCount");
  const cards=[...grid.querySelectorAll("[data-product]")];

  const selected = () => {
    const map={};
    document.querySelectorAll("[data-filter]:checked").forEach(input=>{
      const key=input.dataset.filter;
      map[key] ??= new Set();
      map[key].add(input.value);
    });
    const price=document.querySelector("[data-price-range]:checked")?.dataset.priceRange || "";
    return {map,price};
  };

  const matchesSet=(card,key,set)=>{
    if(!set || set.size===0) return true;
    const raw=(card.dataset[key]||"").split(/\s+/);
    return [...set].some(v=>raw.includes(v) || raw.includes("all"));
  };

  const matchesPrice=(card,range)=>{
    if(!range) return true;
    const [min,max]=range.split("-").map(Number);
    const p=Number(card.dataset.price||0);
    return p>=min && p<max;
  };

  const makeChips=()=>{
    if(!chipWrap) return;
    chipWrap.innerHTML="";
    const checked=[...document.querySelectorAll("[data-filter]:checked")];
    checked.forEach(input=>{
      const chip=document.createElement("span");
      chip.className="filter-chip";
      chip.innerHTML=`${input.closest("label")?.textContent.trim() || input.value}<button type="button" aria-label="Remove filter">×</button>`;
      chip.querySelector("button").addEventListener("click",()=>{
        document.querySelectorAll(`[data-filter="${input.dataset.filter}"][value="${input.value}"]`).forEach(x=>x.checked=false);
        apply();
      });
      chipWrap.appendChild(chip);
    });
    const priceRadio=document.querySelector("[data-price-range]:checked");
    if(priceRadio && priceRadio.dataset.priceRange){
      const chip=document.createElement("span");
      chip.className="filter-chip";
      chip.innerHTML=`${priceRadio.closest("label")?.textContent.trim() || "Price"}<button type="button">×</button>`;
      chip.querySelector("button").addEventListener("click",()=>{
        const all=document.querySelector('[data-price-range=""]');
        if(all) all.checked=true;
        apply();
      });
      chipWrap.appendChild(chip);
    }
    const num=checked.length + (priceRadio?.dataset.priceRange ? 1 : 0);
    if(activeCount) activeCount.textContent=num;
    if(clearAll) clearAll.style.visibility=num ? "visible" : "hidden";
  };

  const syncDuplicateChecks=()=>{
    const groups={};
    document.querySelectorAll("[data-filter]").forEach(input=>{
      const key=`${input.dataset.filter}:${input.value}`;
      groups[key] ??=[];
      groups[key].push(input);
    });
    Object.values(groups).forEach(group=>{
      if(group.length<2) return;
      group.forEach(input=>{
        input.addEventListener("change",()=>{
          group.forEach(x=>{ if(x!==input) x.checked=input.checked; });
          apply();
        });
      });
    });
  };

  const apply=()=>{
    const q=(search?.value||"").trim().toLowerCase();
    const {map,price}=selected();

    let visible=cards.filter(card=>{
      const name=(card.dataset.name||"").toLowerCase();
      return (!q || name.includes(q))
        && matchesSet(card,"skin",map.skin)
        && matchesSet(card,"category",map.category)
        && matchesSet(card,"concern",map.concern)
        && matchesSet(card,"ingredient",map.ingredient)
        && matchesPrice(card,price);
    });

    if(sort?.value==="price-low") visible.sort((a,b)=>Number(a.dataset.price)-Number(b.dataset.price));
    if(sort?.value==="price-high") visible.sort((a,b)=>Number(b.dataset.price)-Number(a.dataset.price));
    if(sort?.value==="name") visible.sort((a,b)=>(a.dataset.name||"").localeCompare(b.dataset.name||""));

    cards.forEach(card=>card.style.display=visible.includes(card)?"":"none");
    visible.forEach(card=>grid.appendChild(card));

    if(countEl) countEl.textContent=visible.length;
    makeChips();
  };

  search?.addEventListener("input",apply);
  sort?.addEventListener("change",apply);
  document.querySelectorAll("[data-price-range]").forEach(x=>x.addEventListener("change",apply));
  document.querySelectorAll("[data-filter]").forEach(x=>x.addEventListener("change",apply));

  const reset=()=>{
    document.querySelectorAll("[data-filter]").forEach(x=>x.checked=false);
    const all=document.querySelector('[data-price-range=""]');
    if(all) all.checked=true;
    if(search) search.value="";
    if(sort) sort.value="";
    apply();
  };
  clearAll?.addEventListener("click",reset);
  clearMobile?.addEventListener("click",reset);

  // Close other desktop dropdowns when one opens.
  document.querySelectorAll(".filter-dropdown").forEach(detail=>{
    detail.addEventListener("toggle",()=>{
      if(detail.open){
        document.querySelectorAll(".filter-dropdown").forEach(other=>{
          if(other!==detail) other.open=false;
        });
      }
    });
  });

  syncDuplicateChecks();
  apply();
});
