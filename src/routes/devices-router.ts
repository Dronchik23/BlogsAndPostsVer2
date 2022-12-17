import {container} from "../composition-root";
import {DevicesController} from "../controller/devices-controller";
import {Router} from "express";
import {authJWTMiddleware} from "../middlewares/bearer-auth-miidleware";


const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('/devices', devicesController.getAllDevices.bind(devicesController))

devicesRouter.delete('/devices', devicesController.deleteAllDevicesExcludeCurrent.bind(devicesController))

devicesRouter.delete('/devices/:deviceId', devicesController
    .deleteDeviceByDeviceId.bind(devicesController))

