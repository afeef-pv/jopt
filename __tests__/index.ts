import { DataType, Jopt } from "..";

describe("Jopt", () => {
    it("Should pass", () => {
        const testData = [
            {name: "Afeef", age: 28, salary: 1000, dob: new Date("2022-02-03") },
            {name: "Fadhil", age: 24, salary: 500, dob: new Date("2021-02-03") },
            {name: "Nouf", age: 21, salary: 10, dob: new Date("1996-02-03") },
        ];
        const jopt = Jopt
            .build([
                { key: "name", type: DataType.STRING },
                { key: "age", type: DataType.NUMBER },
                { key: "salary", type: DataType.NUMBER },
                { key: "dob", type: DataType.DATE },
            ])
            .append(testData);
        const transformedData = jopt.next();
        // expect(transformedData).toBe(`name:age:salary:dob\n1:2:2:0\nAfeef:28:1000:"2022-02-03T00:00:00.000Z"\nFadhil:24:500:"2021-02-03T00:00:00.000Z"\nNouf:21:10:"1996-02-03T00:00:00.000Z"\n`);
        expect(jopt.parse(transformedData)).toEqual(testData);
    });
});
