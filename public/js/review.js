let btn=document.querySelector('.btn');
btn.addEventListener('click',(ev)=>{
    ev.preventDefault();
    let btn=ev.target;
    let id=btn.parentElement.lastElementChild.getAttribute('id');
    let textarea=document.querySelector('textarea')
    axios.post(`/shop/order/reviews`,{
        id,
        rev:textarea.value
    }).then((res)=>{
        console.log('Product Review Added');
    }).catch((err)=>{
        alert(err.message);
    })
})