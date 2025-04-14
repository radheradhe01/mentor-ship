export const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_menttorAddress",
          "type": "address"
        }
      ],
      "name": "getMentor",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "mentorAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "Students",
              "type": "address[]"
            },
            {
              "internalType": "bool",
              "name": "isVerifyed",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "mentorPrice",
              "type": "uint256"
            }
          ],
          "internalType": "struct Mentorship.Mentor",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_studentAddress",
          "type": "address"
        }
      ],
      "name": "getStudent",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "studentAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "Mentors",
              "type": "address[]"
            },
            {
              "internalType": "bool",
              "name": "isSubscribed",
              "type": "bool"
            }
          ],
          "internalType": "struct Mentorship.Student",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "mentors",
      "outputs": [
        {
          "internalType": "address",
          "name": "mentorAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isVerifyed",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "mentorPrice",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_mentorPrice",
          "type": "uint256"
        }
      ],
      "name": "ragistorMentor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "ragistorStudent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "students",
      "outputs": [
        {
          "internalType": "address",
          "name": "studentAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isSubscribed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
] as const