import express from "express";
import { ObjectId } from "mongodb";

import {
  getAllEquipments,
  getEquipmentById,
  createEquipments,
  deleteEquipmentById,
  updateEquipmentById,
} from "../helper.js";

var router = express.Router();

router
  .route("/")
  .post(async (request, response) => {
    const data = request.body;
    console.log(data);
    const result = await createEquipments(data);
    response.send(result);
    //data should be in json
  })
  .get(async (request, response) => {
    const filter = request.query;
    console.log(filter);
    if (filter.e_id) {
      filter.e_id = parseInt(filter.e_id);
    }
    //normally db.coll.find({language:"hindi",rating:8})
    const filteredEquipment = await getAllEquipments(filter); // if we want curser then no need to use toArray()
    response.send(filteredEquipment);
  });

router
  .route("/:_id")
  .get(async (request, response) => {
    const { _id } = request.params;
    console.log(_id);
    const equipment = await getEquipmentById(ObjectId(_id));
    equipment
      ? response.send(equipment)
      : response.status(404).send({ msg: "no movie with this id" });
  })
  .delete(async (request, response) => {
    const { _id } = request.params;
    console.log(_id);
    const result = await deleteEquipmentById(ObjectId(_id));
    result.deletedCount > 0
      ? response.send(result)
      : response.status(404).send({ message: "no match" });
  })
  .put(async (request, response) => {
    const { _id } = request.params;
    console.log(_id);
    const data = request.body;
    const result = await updateEquipmentById(ObjectId(_id), data);
    const updatedEquipment = await getEquipmentById(ObjectId(_id));
    response.send(updatedEquipment);
  });

export const equipmentsRouter = router;
