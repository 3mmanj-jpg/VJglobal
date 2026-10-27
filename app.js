document.addEventListener("DOMContentLoaded",()=>{
 const toggle=document.querySelector(".menu-toggle"), links=document.querySelector(".nav-links");
 if(toggle&&links){toggle.addEventListener("click",()=>{const open=links.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});}
 document.querySelectorAll("form[data-inquiry-form]").forEach(form=>{
  form.addEventListener("submit",async event=>{
   event.preventDefault();
   const status=form.querySelector(".form-status");
   const submit=form.querySelector('button[type="submit"]');
   if(!form.reportValidity()) return;
   if(form.querySelector('[name="website"]')?.value){return;}
   const original=submit.textContent;submit.disabled=true;submit.textContent="Sending...";
   status.className="form-status";status.textContent="";
   try{
    const payload=Object.fromEntries(new FormData(form).entries());
    const response=await fetch("/api/inquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(result.error||"We couldn't send your inquiry right now. Please try again later.");
    status.textContent="Thank you. Your inquiry has been sent. The VJ Global team will follow up.";status.className="form-status success show";form.reset();
   }catch(error){
    status.textContent=error.message||"Unable to send right now. Please try again later.";status.className="form-status error show";
   }finally{submit.disabled=false;submit.textContent=original;}
  });
 });
});
