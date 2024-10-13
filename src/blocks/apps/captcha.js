import * as Blockly from "blockly/core";
import { Order, javascriptGenerator } from "blockly/javascript";
import { createRestrictions } from "../../functions/restrictions";

Blockly.Blocks["captcha_create"] = {
  init: function () {
    this.appendDummyInput().appendField("Create new random captcha");
    this.setPreviousStatement(true, "default");
    this.setNextStatement(true, "default");
    this.setColour("#0fbd8c");
  },
};

javascriptGenerator.forBlock["captcha_create"] = () =>
  "let captcha = new Captcha();\n";

Blockly.Blocks["captcha_send"] = {
  init: function () {
    this.appendValueInput("channel")
      .setCheck("channel")
      .appendField("Send captcha to channel:");
    this.setPreviousStatement(true, "default");
    this.setNextStatement(true, "default");
    this.setColour("#0fbd8c");
    this.setTooltip("Sends a captcha image in a channel");
  },
};

javascriptGenerator.forBlock["captcha_send"] = function (block, generator) {
  const channel = generator.valueToCode(block, "channel", Order.ATOMIC);

  const code = `${channel}.send({
  files: [{ attachment: captcha.PNGStream, name: "captcha.png" }]
});\n`;

  return code;
};

Blockly.Blocks["captcha_reply"] = {
  init: function () {
    this.appendValueInput("message")
      .setCheck("message")
      .appendField("Reply captcha to message:");
    this.setPreviousStatement(true, "default");
    this.setNextStatement(true, "default");
    this.setColour("#0fbd8c");
    this.setTooltip("Replies to a message with a captcha");
  },
};

javascriptGenerator.forBlock["captcha_reply"] = function (block, generator) {
  const message = generator.valueToCode(block, "message", Order.ATOMIC);

  return `${message}.reply({
  files: [{ attachment: captcha.PNGStream, name: "captcha.png" }]
});\n`;
};

Blockly.Blocks["captcha_value"] = {
  init: function () {
    this.appendDummyInput().appendField("get value of captcha");
    this.setOutput(true, "String");
    this.setColour("#0fbd8c");
    this.setTooltip("Gets the value of the captcha");
  },
};

javascriptGenerator.forBlock["captcha_value"] = () => [
  "captcha.value",
  Order.NONE,
];

createRestrictions(
  ["captcha_value", "captcha_send", "captcha_reply"],
  [
    {
      type: "hasBlockInParent",
      blockTypes: ["captcha_create"],
      message:
        'This block must be used AFTER "create new random captcha" block',
    },
  ]
);

createRestrictions(
  ["captcha_send"],
  [
    {
      type: "notEmpty",
      blockTypes: ["channel"],
      message: "You must specify the channel to send the captcha in",
    },
  ]
);

createRestrictions(
  ["captcha_reply"],
  [
    {
      type: "notEmpty",
      blockTypes: ["message"],
      message: "You must specify the message to reply with the captcha",
    },
  ]
);
