import {container} from "../composition-root";
import {DevicesController} from "../controller/devices-controller";
import {Router} from "express";
import {refreshTokenMiddleware} from "../middlewares/refresh-token-middleware";


const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('/devices', refreshTokenMiddleware, devicesController.getAllDevices.bind(devicesController))

devicesRouter.delete('/devices', refreshTokenMiddleware, devicesController
    .deleteAllDevicesExcludeCurrent.bind(devicesController))

devicesRouter.delete('/devices/:deviceId', refreshTokenMiddleware, devicesController
    .deleteDeviceByDeviceId.bind(devicesController))

