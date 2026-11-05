'use strict';
const chalk = require('chalk');

console.clear();

console.log(chalk.red(`𝐌𝐨𝐧𝐞𝐲 𝐝𝐨𝐞𝐬𝐧'𝐭 𝐛𝐞𝐭𝐫𝐚𝐲 𝐲𝐨𝐮. 𝐇𝐚𝐫𝐝 𝐰𝐨𝐫𝐤 𝐝𝐨𝐞𝐬𝐧'𝐭 𝐛𝐞𝐭𝐫𝐚𝐲 𝐲𝐨𝐮. 𝐁𝐮𝐭 𝐋𝐥𝐨𝐲𝐝? 𝐇𝐞 𝐦𝐢𝐠𝐡𝐭-𝐮𝐧𝐥𝐞𝐬𝐬 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐚 𝐜𝐨𝐧𝐭𝐫𝐚𝐜𝐭.`));

console.log(chalk.white(`𝐖𝐀𝐓𝐄𝐑 𝐈𝐒 𝐆𝐎𝐎𝐃. 𝐁𝐔𝐓 𝐌𝐎𝐍𝐄𝐘 𝐈𝐒 𝐁𝐄𝐓𝐓𝐄𝐑.`));

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));

var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};

var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.proto = exports.makeWASocket = void 0;

const WAProto_1 = require("../WAProto");
Object.defineProperty(exports, "proto", {
    enumerable: true,
    get: function() {
        return WAProto_1.proto;
    }
});

const Socket_1 = __importDefault(require("./Socket"));
exports.makeWASocket = Socket_1.default;

__exportStar(require("../WAProto"), exports);
__exportStar(require("./Utils"), exports);
__exportStar(require("./Types"), exports);
__exportStar(require("./Store"), exports);
__exportStar(require("./Defaults"), exports);
__exportStar(require("./WABinary"), exports);
__exportStar(require("./WAM"), exports);
__exportStar(require("./WAUSync"), exports);

exports.default = Socket_1.default;
