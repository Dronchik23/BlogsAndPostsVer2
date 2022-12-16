import {container} from "../composition-root";
import {DevicesController} from "../controller/devices-controller";
import {Router} from "express";

const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('devices', devicesController.getAllDevices.bind(devicesController))

