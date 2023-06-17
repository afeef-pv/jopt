export enum DataType {
    DATE,
    STRING,
    NUMBER,
    ARRAY,
    OBJECT
}

type Schema = {
    type: DataType;
    key: string;
};

export const DELIMITER = '\t';

export class Jopt {
    private jsons: Array<{ [key: string]: any }> = [];

    constructor(private schema: Array<Schema>) {}

    static build(schema: Array<Schema>): Jopt {
        return new Jopt(schema);
    }

    append(data: Array<{ [key: string]: any }>): Jopt {
        this.jsons = data;
        return this;
    }

    getHeaders(): string {
        return this.schema.map(s => s.key).join(DELIMITER) + '\n'
            + this.schema.map(s => s.type).join(DELIMITER) + '\n';
    }

    next(): string {
        let result = this.getHeaders();
        let line: Array<string | number>;
        for (let j = 0; j < this.jsons.length; ++j) {
            line = [];
            for (let h = 0; h < this.schema.length; ++h) {
                if (this.jsons[j][this.schema[h].key]) {
                    if (
                        this.schema[h].type === DataType.STRING ||
                        this.schema[h].type === DataType.NUMBER
                    ) {
                        line.push(this.jsons[j][this.schema[h].key]);
                    }
                    else {
                        line.push(JSON.stringify(this.jsons[j][this.schema[h].key]));
                    }
                } else {
                    line.push('');
                }
            }
            result += line.join(DELIMITER) + '\n';
        }
        return result;
    }

    parse(rawData: string | string[]) {
        if (typeof rawData == "string") {
            rawData = rawData.split('\n');
        }
        if (rawData.length < 2) {
            throw new Error("Corrupted data");
        }
        const keys = rawData[0].split(DELIMITER);
        const types: DataType[] = rawData[1].split(DELIMITER).map((e) => parseInt(e));
        const result: Array<{ [key: string]: any }> = [];

        for (let i = 2; i < rawData.length - 1; ++i) {
            result[i - 2] = {};
            const holder = result[i - 2];
            const values = rawData[i].split(DELIMITER);
            for (let k = 0; k < keys.length; ++k) {
                holder[keys[k]] = this.parseValue(values[k], types[k]);
            }
        }
        return result;
    }

    parseValue(value: string, type: DataType) {
        if (type === DataType.NUMBER) {
            return +value;
        } else if (type === DataType.DATE) {
            return new Date(value.replace(/"/g, ''));
        } else {}
        return value;
    }
}

