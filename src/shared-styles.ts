import { css } from 'lit';

export const sharedStyles = css`

  .action-button {
    font-size: 14pt;
    color: red;
    font-family: "tablet-gothic", sans-serif;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-right: 20px;
    padding-left: 20px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 18px;
    background-color: black;
    margin-top: 15px;
    border: none;
  }

  .action-button:active {
    transform: scale(0.9);
    background-color: #8b1a0c;
    transition: background-color 200ms linear;
  }

  .action-button-red {
    background-color: red;
    color: black;
    border: 1px solid black;
    z-index: 1000;
    position: relative;
    padding-top: 5px;
    padding-bottom: 7px;
    padding-right: 20px;
    padding-left: 20px;
    margin-left: auto;
    margin-right: auto;
    font-size: 14pt;
    font-family: "tablet-gothic", sans-serif;
    border-radius: 18px;
    margin-top: 15px;
  }
  
  .action-button-red:active {
    animation: bounce 4500ms;
    transform: scale(0.9);
    transition: background-color 100ms linear;
  }
`;