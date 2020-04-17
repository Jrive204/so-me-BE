const express = require("express");
const Topics = require("./topics-model.js");
const Joi = require("@hapi/joi");
const router = express.Router();
const Query = require("../../query");

const schema = Joi.object({
  user_id: Joi.number(),
  title: Joi.string().required(),
  cards: Joi.array(),
  index: Joi.number(),
});

router.get("/", (req, res) => {
  Topics.find()
    .then((topics) => {
      res.status(200).json({ topics });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving Topics",
        Error: err,
      });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Topics.find({ id })
    .first()
    .then((topics) => {
      console.log(!topics.cards.length);
      !topics.length
        ? res.status(200).json(topics)
        : res.json(404).json("no topic found");
    })
    .catch((err) => {
      res.status(404).json({
        message: "topic with specified ID not found",
        Error: err,
      });
    });
});

router.get("/:id/user", (req, res) => {
  const { id } = req.params;
  const { sortby } = req.query;
  console.log(req.query);

  // Topics.getTopicCards(id)
  Query.getTopics({ sortby }, id)
    .then((topics) => {
      !topics.length
        ? res.status(404).json("topics for this user not found")
        : res.status(200).json(topics);
    })
    .catch((err) => {
      res.status(404).json({
        message: "User with specified ID not found",
        Error: err.message,
      });
    });
});

// POST START HERE ----------------

router.post("/:id/user", (req, res) => {
  const { id } = req.params;
  const topicbody = { ...req.body, user_id: id };
  console.log(req.body);
  // if (Object.keys(topicbody).length === 0 || schema.validate(topicbody).error) {
  //   res.status(500).json(schema.validate(topicbody).error);
  // } else {
  // }
  Topics.add(req.body) //May need to change depending on payload
    .then((value) => {
      res.status(200).json(value);
    })
    .catch((err) => {
      console.log({ Error: err.message, stack: err.stack, code: err.code });
      res.status(500).json({
        message: "topic cannot be added",
        Error: err.message,
        stack: err.stack,
        code: err.code,
      });
    });
});

// PUT START HERE --------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const update = req.body;

  Topics.update(update, id)
    .then((value) => {
      res.status(201).json({ value });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({
        message: "Topic cannot be updated",
        Error: err.message,
        code: err.code,
        stack: err.stack,
      });
    });
});

// DELETE START HERE ------------
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Topics.remove(id)
    .then((response) => {
      res.status(200).json({ message: "Topic deleted", response });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Topic cannot be removed", Error: err.message });
    });
});

module.exports = router;
