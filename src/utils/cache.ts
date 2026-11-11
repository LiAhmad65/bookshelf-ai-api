import NodeCache from "node-cache";

// stdTTL: 60 seconds (Yani cache 60 second tak valid rahega, aap isay change bhi kar sakte hain)
export const cache = new NodeCache({ stdTTL: 180 });