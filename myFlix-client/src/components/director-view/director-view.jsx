import React from "react";
import PropTypes from "prop-types";
import "./director-view.scss";
import { Row, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
export class DirectorView extends React.Component {
  render() {
    const { director, onBackClick } = this.props;

    return (
      <Row>
        <Card className="director-card">
          <Card.Title>
            <span className="label">Name: </span>
            <span className="value">{director.Name}</span>
          </Card.Title>
          <Card.Body>
            <span className="label">Bio: </span>
            <span className="value">{director.Bio}</span>
          </Card.Body>
          <Card.Body>
            <span className="label">Birth: </span>
            <span className="value">{director.Birth}</span>
          </Card.Body>
          <Card.Body>
            <span className="label">Death: </span>
            <span className="value">{director.Death}</span>
          </Card.Body>
        </Card>

        <Button
          variant="link"
          onClick={() => {
            onBackClick();
          }}
        >
          Back
        </Button>
      </Row>
    );
  }
}

DirectorView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
    Death: PropTypes.string.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
