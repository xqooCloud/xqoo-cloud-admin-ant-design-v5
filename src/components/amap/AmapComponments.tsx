import React, {useState} from "react";
import {Map,Marker} from 'react-amap';
import {xqooConstants} from "../../../config/xqooConstants";
import {MapData} from "@/services/PublicInterface";
const mapKey = xqooConstants.amapKey;

export interface AmapComponmentsProps{
  readonly?: boolean;
  lng?: number;
  lat?: number;
  title?: string;
  zoom?: number;
  backData?: (addressData: MapData) => void;
}

const AmapComponments: React.FC<AmapComponmentsProps> = (props) => {
  const {readonly, lng, lat, zoom, backData} = props;
  const [signAddrList, setSignAddrList] = useState<{name: string; addr: string; longitude: number; latitude: number;}>({name: '', addr: '', longitude: 0, latitude: 0});

  const events = {
    created: (e: any) => {
      if(lng && lat){
        setSignAddrList({
          addr: '',
          latitude: lat,
          longitude: lng,
          name: ''
        });
      }
    },
    click: (e: any) => {
      let geocoder;
      window.AMap.plugin(["AMap.Geocoder"],function(){
        geocoder = new AMap.Geocoder({
          radius:1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
          extensions: "all"//返回地址描述以及附近兴趣点和道路信息，默认"base"
        });
        geocoder.getAddress(e.lnglat,function (status: string, result: { regeocode: { formattedAddress: any; addressComponent: any; }; }) {
          if (status === 'complete' && result.regeocode && !readonly) {
            let address = result.regeocode.formattedAddress;
            let data = result.regeocode.addressComponent;
            let name = data.township +data.street + data.streetNumber;
            setSignAddrList({
              addr: address,
              latitude: e.lnglat.lat,
              longitude: e.lnglat.lng,
              name: name
            });
            if (backData) {
              backData({
                lng: e.lnglat.lng,
                lat: e.lnglat.lat,
                city: data.city,
                country: data.country,
                district: data.district,
                neighborhood: data.neighborhood,
                neighborhoodType: data.neighborhoodType,
                province: data.province,
                street: data.street,
                streetNumber: data.streetNumber,
                township: data.township,
                formatAddress: address
              });
            }
          }
        })
      });
    }
  }

  return (
    <div style={{width: '100%', height: '400px'}}>
      {
        signAddrList.longitude && signAddrList.latitude ?
          <Map
            amapkey={mapKey}
            plugins={['Scale']}
            events={events}
            center={[signAddrList.longitude, signAddrList.latitude]}
            zoom={zoom ? zoom : 20}
          >
            <Marker position={[ signAddrList.longitude,signAddrList.latitude]}/>
          </Map>
          :
          <Map
            amapkey={mapKey}
            plugins={['Scale']}
            events={events}
            zoom={zoom ? zoom : 20}
          >
            <Marker position={[ signAddrList.longitude,signAddrList.latitude]}/>
          </Map>
      }
    </div>
  );
}
export default AmapComponments;
