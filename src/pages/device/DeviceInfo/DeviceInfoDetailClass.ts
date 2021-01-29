import {DeviceDetailEntity} from "@/pages/device/DeviceInfo/data";

class DeviceInfoDetailClass{
  deviceInfoDetail: DeviceDetailEntity;

  constructor (deviceInfo: DeviceDetailEntity | undefined) {
    if(!deviceInfo){
      this.deviceInfoDetail = {
        pictureList: [],
        propertiesList: [],
        id: "",
        delFlag: 0,
        screenStatus: 0,
        screenTips: '初始化设备信息'
      }
    }else{
      this.deviceInfoDetail = Object.assign(deviceInfo);
    }
  }
  initDeviceInfo() {
    return this.deviceInfoDetail;
  }
}
export default DeviceInfoDetailClass;
