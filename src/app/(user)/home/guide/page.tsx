import {Carousel, Steps} from "antd";
import First from "@/component/guideStep/1stguide";

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
        <Carousel arrows autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
            <div>
                {/*<h3 style={contentStyle}>Connect to Hubspot</h3>*/}
            <First/>
            </div>
            <div>
                <h3 style={contentStyle}>Connect to Google Drive</h3>
                <First/>

            </div>
            <div>
                <h3 style={contentStyle}>Connect Hubspot to Google Drive to storage your data</h3>
                <First/>

            </div>
            <div>
                <h3 style={contentStyle}>Done, Enjoy !!!</h3>
                <First/>

            </div>
        </Carousel>
    )
}
export default GuidePage;