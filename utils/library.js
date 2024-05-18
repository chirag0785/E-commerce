function getProductCategoryWise(prod){
    let data={};
        prod.forEach((p)=>{
            data[p.category]=[];
        })
        prod.forEach((p)=>{
            data[p.category].push(p);
        })
    return data;
}
module.exports=getProductCategoryWise;