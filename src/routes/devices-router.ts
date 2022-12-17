import {container} from "../composition-root";
import {DevicesController} from "../controller/devices-controller";
import {Router} from "express";
import rateLimit from 'express-rate-limit'


const limiter = rateLimit({
    windowMs: 10000,
    max: 5
})


const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('/devices', limiter, devicesController.getAllDevices.bind(devicesController))

devicesRouter.delete('/devices', limiter, devicesController.deleteAllDevicesExcludeCurrent.bind(devicesController))

devicesRouter.delete('/devices/:deviceId', limiter, devicesController
    .deleteDeviceByDeviceId.bind(devicesController))

