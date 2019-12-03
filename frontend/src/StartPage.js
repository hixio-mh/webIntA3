import React, { Component } from 'react';
import { Button, Row, Col, Container, Form, Spinner } from 'react-bootstrap';




export default class StartPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: null,
			typeChoice: 'wordOne'
		};
	}

	async componentDidMount() {

  
	}

	

	handleTypeChange = async (event) => {
		const choice = event.target.value
		this.setState({typeChoice: choice})
	}
	

    requestData = async () => {
		this.setState({isLoading: true})
		let response = null;
		if (this.state.typeChoice === 'wordOne') {
			response = await fetch(`http://localhost:1337/wordOne`);
		} else if (this.state.typeChoice === 'wordMore') {
			response = await fetch(`http://localhost:1337/wordMore`);
		} else if (this.state.typeChoice === 'pageRank') {
			response = await fetch(`http://localhost:1337/pageRank`);
		}

	}



	renderAll = () => {
		return (
			<>
			<Row style={{ marginTop: 10, marginBottom: 10 }}></Row>
                <Row>Search engine choices</Row>
                <Row style={{ marginTop: 10, marginBottom: 10 }}></Row>
				<Form>
					Choose Mode:
					<Form.Control defaultValue={this.state.typeChoice} as="select" onChange={this.handleTypeChange} style={{ width: 200 }}>
						<option>wordOne</option>
                        <option>wordMore</option>
                        <option>pageRank</option>
		            </Form.Control>
				</Form>
				<Row style={{ marginTop: 10, marginBottom: 10 }}></Row>
                {this.state.isLoading ? 
				<Button variant="primary" disabled>
    				<Spinner
      					as="span"
      					animation="grow"
      					size="sm"
      					role="status"
      					aria-hidden="true"
    				/>
    				Loading...
  				</Button>: <Button onClick={this.requestData}>Send Request to Server</Button>}
                <Row style={{ marginTop: 10, marginBottom: 10 }}></Row>
			</>
		)
	}
    
	render() {
		return (
			<Container>
				{this.renderAll()}
			</Container>
		);
	}
}

