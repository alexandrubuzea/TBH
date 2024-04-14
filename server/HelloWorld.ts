// highlight-next-line
import { GenezioDeploy } from "@genezio/types";
import { SmartContract } from "./utils";

// make our transaction datatype

export type Transaction = {
	from : string;
	to : string;
	amount : number;
	contract : string; 
}

let group : any = {}

let inheritorContractMap : Map<string, string> = new Map<string, string>()

let inheritors : Set<string> = new Set<string>();

// highlight-next-line
@GenezioDeploy()
export class ServerClass {

	async postTransaction(tr : Transaction) : Promise<boolean> {
		const {from, to, amount, contract} = tr;

		if (group[from] !== undefined)
			return false

		group[from] = to

		inheritors.add(to)

		inheritorContractMap.set(to, contract);

		return true
	}
	

	async isInheritor(address: string) : Promise<boolean> {
		if (inheritors.has(address))
			return true;

		return false;
	} 

	async getContractAddress(inheritor: string) {
		if (!inheritorContractMap.has(inheritor))
			return '';

		return inheritorContractMap.get(inheritor);
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