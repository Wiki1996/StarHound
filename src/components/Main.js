import React, {Component} from 'react';
import { Row, Col} from 'antd';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";
import axios from 'axios';
import WorldMap from './WorldMap';




class Main extends Component {
    constructor(){
        super();
        this.state = {
            satInfo: null,
            satList: null,
            setting: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = (setting) => {
        this.setState({
            setting: setting
        });
        this.fetchSatellite(setting);
    };

    fetchSatellite= (setting) => {
        //1.abstract api paras from the setting
        const { latitude, longitude, elevation, altitude } = setting;

        //2. send request to fetch data
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        //3. add spin
        this.setState({
            isLoadingList: true
        });

        axios
            .get(url)
            .then(response => {
                console.log(response.data)
                this.setState({
                    satInfo: response.data,
                    //4.remove spin
                    isLoadingList: false
                });
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
            })
    }

    showMap = (selected) => {
        console.log(selected);
        //setstate
        this.setState( preState => ({
            ...preState,
            satList:[...selected]
        }))
    }

    render() {
        const { satInfo , satList, isLoadingList, setting } = this.state;
        return (
            <Row className='main'>
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList}
                                   onShowMap={this.showMap}

                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        );
    }
}
export default Main;
