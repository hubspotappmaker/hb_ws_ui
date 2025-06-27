import {Carousel, Steps} from "antd";
import First from "@/component/guideStep/1stguide";
import Second from "@/component/guideStep/2ndguide";
import Third from "@/component/guideStep/3rdguide";

const contentStyle: React.CSSProperties = {
    // height: '50px',
    color: '#fff',
    // lineHeight: '1000px',
    textAlign: 'center',
    background: '#003aa1',
};
// autoplay={{ dotDuration: true }} autoplaySpeed={5000}
const GuidePage = () => {
    return (
        <Carousel arrows autoplay={{ dotDuration: true }} autoplaySpeed={3000}>
            <div>
                <First/>
            </div>
            <div>
                <Second/>
            </div>
            <div>
                <Third/>
            </div>
            {/*<div>*/}
            {/*    <First/>*/}
            {/*</div>*/}
        </Carousel>
    )
}
export default GuidePage;