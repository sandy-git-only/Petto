import styled from 'styled-components';


export const TitleBlock = styled.div`
    display: flex;
    justify-content:flex-start;
    width: 100%;
    align-items: center;
    gap: 10px;
`;

export const Name = styled.text`
    font-size: 40px;
    font-weight: bold;
    color: #000000;
`
export const Breed = styled.text`
    font-size: 75%;
    margin-top: 15px;
`

export const Images = styled.img`
  width: 200px;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  border-radius: 10%;
  background-color: #000000;
  margin: 20px 0;
`;