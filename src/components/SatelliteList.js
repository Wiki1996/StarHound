import React, {Component} from 'react';
import { Button, Spin, List, Checkbox, Avatar} from 'antd';
import satellite from "../assets/images/satellite.svg";


class SatelliteList extends Component {
    constructor(){
        super();
        this.state = {
            selected: [],
            isLoad: false
        };
    }

    onChage = (e) => {
        //get sat infor and check status
        const {dataInfo, checked} = e.target;
        const {selected} = this.state;
        //add or remove the sat to selected satlist
        const list = this.addOrRemove(dataInfo, checked, selected);
        //set state to selected
        this.setState({selected: list});
    }

    addOrRemove = (item, status, list) => {
        const found = list.some( entry => entry.satid === item.satid );
        //checked and item not in the list -> add
        if(status && !found){
            list=[...list, item]
        }

        //not check and item in the list -> remove
        if(!status && found ) {
            list = list.filter( entry => {
                return entry.satid !== item.satid;
            });
        }
        return list;
    }

    showMap = () => {
        this.props.onShowMap(this.state.selected);
    }

    render() {
        const { selected } = this.state;
        const {satInfo, isLoad} = this.props;
        const satList = satInfo ? satInfo.above : [];
        return (
            <div className="sat-list-box">
                    <Button
                        className="sat-list-btn"
                        size="large"
                        type="primary"
                        disabled={ selected.length === 0}
                        onClick={this.showMap}>
                        Track on the map
                    </Button>
                <hr/>
                {
                    isLoad ?
                        <div className="spin-box">
                            <Spin tip="Loading..." size="large" />
                        </div>
                        :
                        <List
                            className="sat-list"
                            itemLayout="horizontal"
                            size="small"
                            dataSource={satList}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Checkbox dataInfo={item} onChange={this.onChage}/>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size={50} src={satellite}/>}
                                        title={<p>{item.satname}</p>}
                                        description={`Launch Date: ${item.LaunchDate}`}
                                    />
                                </List.Item>
                            )}
                        />
                }
            </div>
        );
    }
}
export default SatelliteList;
