import express from "express";
import {
  getAllEquipments,
  getEquipmentById,
  createEquipments,
  deleteEquipmentById,
  updateEquipmentById,
} from "../helper.js";
var router = express.Router();

router.post("/", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await createEquipments(data);
  response.send(result);
  //data should be in json
});

router.get("/", async (request, response) => {
  const filter = request.query;
  console.log(filter);
  if (filter.e_id) {
    filter.e_id = parseInt(filter.e_id);
  }
  //normally db.coll.find({language:"hindi",rating:8})
  const filteredEquipment = await getAllEquipments(filter); // if we want curser then no need to use toArray()
  response.send(filteredEquipment);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  console.log(id);
  const equipment = await getEquipmentById(id);
  equipment
    ? response.send(equipment)
    : response.status(404).send({ msg: "no movie with this id" });
});

//delete movie by id
router.delete("/:e_id", async (request, response) => {
  const { e_id } = request.params;
  console.log(e_id);
  const result = await deleteEquipmentById(e_id);
  result.deletedCount > 0
    ? response.send(result)
    : response.status(404).send({ message: "no match" });
});

router.put("/:e_id", async (request, response) => {
  const { e_id } = request.params;
  console.log(e_id);
  const data = request.body;
  const result = await updateEquipmentById(e_id, data);
  const updatedEquipment = await getEquipmentById(e_id);
  response.send(updatedEquipment);
});

export const equipmentsRouter = router;
