import Skus from "../../components/skus/Sku.jsx";
import './style.scss';
import RnpMain from "../../components/rnpMain/RnpMain.jsx";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import RnpCharts from "../../components/rnpCharts/RnpCharts.jsx";

const MainPage = () => {

    return (
        <div className='mainPageContainer'>
            <div className='skus'>
                <Skus/>
            </div>

            <div className='container'>
                <div className='title'>
                    <h3>Рука на пульсе</h3>

                    <div className='video'>
                        <PlayCircleIcon/>
                        Инструкция
                    </div>
                </div>

                <div className='filters'>

                </div>

                <div className='mainTable'>
                    < RnpMain/>
                    {false && <RnpCharts/>}
                </div>
            </div>
        </div>
    )
}

export default MainPage