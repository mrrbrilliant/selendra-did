const passport = {
    $id: "kilt:ctype:0xda3861a45e0197f3ca145c2c20f9f126e5053fas503e459af4255cf8011d51010",
    $schema: "http://kilt-protocol.org/draft-01/ctype#",
    title: "KYC and Passport",
    type: "object",
    properties: {
        fullName: {
            type: "string",
        },
        passportIdentifer: {
            type: "string",
        },
        streetAddress: {
            type: "string",
        },
        city: {
            type: "string",
        },
    },
};

const kyc = {
    $id: "kilt:ctype:0xda3861a45e0197f3ca145c2c20f9f126e5053fas503e459af4255cf8011d51010",
    $schema: "http://kilt-protocol.org/draft-01/ctype#",
    title: "KYC and Passport",
    type: "object",
    properties: {
        ID: {
            type: "string",
        },
        number: {
            type: "string",
        },
        name: {
            type: "string",
        },
    },
};

const nested = {
    $id: "kilt:ctype:0xda3861a45e0197f3ca145c2c20f9f126e5053fas503e459af4255cf8011d51010",
    $schema: "http://kilt-protocol.org/draft-01/ctype#",
    title: "KYC and Passport",
    type: "object",
    properties: {
        fullName: {
            $ref: `${passport.schema.$id}#/properties/fullName`,
        },
        passportIdentifer: {
            $ref: `${passport.schema.$id}#/properties/passportIdentifer`,
        },
        streetAddress: {
            $ref: `${passport.schema.$id}#/properties/streetAddress`,
        },
        city: {
            $ref: `${passport.schema.$id}#/properties/city`,
        },
        state: {
            $ref: `${passport.schema.$id}#/properties/city`,
        },
        ID: {
            $ref: `${kyc.schema.$id}#/properties/ID`,
        },
        number: {
            $ref: `${kyc.schema.$id}#/properties/number`,
        },
        name: {
            $ref: `${kyc.schema.$id}#/properties/name`,
        },
    },
};
