import express from "express";
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
  .route("/:e_id")
  .get(async (request, response) => {
    const { e_id } = request.params;
    console.log(e_id);
    const equipment = await getEquipmentById(e_id);
    equipment
      ? response.send(equipment)
      : response.status(404).send({ msg: "no movie with this id" });
  })
  .delete(async (request, response) => {
    const { e_id } = request.params;
    console.log(e_id);
    const result = await deleteEquipmentById(e_id);
    result.deletedCount > 0
      ? response.send(result)
      : response.status(404).send({ message: "no match" });
  })
  .put(async (request, response) => {
    const { e_id } = request.params;
    console.log(e_id);
    const data = request.body;
    const result = await updateEquipmentById(e_id, data);
    const updatedEquipment = await getEquipmentById(e_id);
    response.send(updatedEquipment);
  });

export const equipmentsRouter = router;
