import Category from "./category";
import Etiquette from "./etiquette";
import activity from "./activity";
import { useState, useEffect } from "react";

// 분석 결과가 etiqutte인지 category인지에 따라 다른 페이지로 이동
const analyze =(type)=> {
    useEffect(() => {
        // 분석 결과를 받아옴
        // 분석 결과가 etiqutte인지 category인지에 따라 다른 페이지로 이동
        
        // 업로드 페이지에서 분석 종류 받아와야함
        type === 'category' ? setCategory(true) : setCategory(false);
        setLoading(false);
    }, []);
    const [isLoading, setLoading] = useState(true);// 로딩중이면 true
    const [isCategory, setCategory] = useState(true);// 타입분석이면 true
    isLoading ? activity() : (
        isCategory ? <Category/> : <Etiquette/>
    );
}
// export default analyze;
export { Category, Etiquette };