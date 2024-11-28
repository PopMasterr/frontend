import styled from "styled-components";

const stiliai = styled.p`
position:absolute;
width: 100px,
height: 10px;
flex-shrink: 0;
color: #FFF;
font-size: 65px;
font-style: normal;
font-weight: 10;
line-height: normal;`;

export const Skaiciai = [
  {
    value: "2,200/km²",
    stilius: styled(stiliai)`
      transform: rotate(3.412deg);
      left: 40%;
      top: 8%;
    `,
  },
  {
    value: "11,313/km²",
    stilius: styled(stiliai)`
      transform: rotate(-9.243deg);
      left: 65%;
      top: 1%;
    `,
  },
  {
    value: "1,560/km²",
    stilius: styled(stiliai)`
      transform: rotate(10.314deg);
      left: 30%;
      top: 26%;
    `,
  },
  {
    value: "441/km²",
    stilius: styled(stiliai)`
      transform: rotate(-9.243deg);
      left: 60%;
      top: 22%;
    `,
  },
];
