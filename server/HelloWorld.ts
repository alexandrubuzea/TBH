// highlight-next-line
import { GenezioDeploy } from "@genezio/types";
import { SmartContract } from "./utils";

// make our transaction datatype

export type Transaction = {
	from : string;
	to : string;
	amount : number;
}

let group : any = {}

// highlight-next-line
@GenezioDeploy()
export class ServerClass {

	async postTransaction(tr : Transaction) : Promise<boolean> {
		const {from, to, amount} = tr;

		if (group[from] !== undefined)
			return false

		group[from] = to

		// TODO: blockchain / create a contract
		return true
	}



	

	async sendNotification(inheritor : string) : Promise<any> {
		return null
	}

	async acceptInheritance(tr : Transaction) : Promise<boolean> {
		const {from, to, amount} = tr
		
		if (from in group) {
			group.erase(from)
			return true
		}
	
		return false
	}
}