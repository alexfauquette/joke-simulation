var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];



function Graphe(id_crayon, limites, bordures_noeud, fonds_noeud, couleurs_texte_noeud, couleurs_arete, epaisseurs_arete){
	//limites contient [x,y,largeur,hauteru] a respecter pour le canevas
	this.noeuds = [];
	this.aretes = [];
	this.crayon = document.getElementById(id_crayon).getContext("2d");
	this.limites = limites;

	//informations sur la representatiosn des noeuds et aretes en fonctions de leux etats respectifs
	this.bordures_noeud = bordures_noeud;
	this.fonds_noeud = fonds_noeud;
	this.couleurs_texte_noeud = couleurs_texte_noeud;
	this.couleurs_arete = couleurs_arete;
	this.epaisseurs_arete = epaisseurs_arete;

	this.matrice = [];
	this.sommets = [];
	this.ponderations = [];

	this.pondere = true;
	this.oriente = false;

	this.nouveau_nom = function(){
		for(var i = 0 ; i<26; i++){
			if( this.sommets.indexOf(alphabet[i]) == -1 ){
				return alphabet[i];
			}
		}
		var i = 1;
		while( this.sommets.indexOf(""+i) >=0 ){
			i++;
		}
		return ""+i;
	}
	
	this.nouvelle_ponderation = function(){
		i = 1;
		while( this.ponderations.indexOf(""+i) >=0 ){
			i++;
		}
		return ""+i;
	}

	this.ajouterNoeud = function(x,y,dx,nom){

		if(nom === ""){
			var nom = this.nouveau_nom();//On choisit un nom au sommet
		}
		
		this.noeuds.push( new Noeud(this.crayon, x, y, dx, dx, nom, "Cercle", this.bordures_noeud, this.fonds_noeud, this.couleurs_texte_noeud) );
		this.sommets.push(nom);

		//mise a jour de la matrice d'adjacence
		var taille = this.matrice.length + 1;
		this.matrice.push(new Array());
		for(var i = 0; i<taille-1;i++){
			if(taille > 1){
				//Si la matrice n'était pas vide
				this.matrice[i].push('inf');
			}
			this.matrice[taille-1].push('inf');
		}
		this.matrice[taille-1].push('inf');

		this.noeuds[this.noeuds.length-1].tracer();//on trace le noeud qui vient d'etre ajoute

	}
	
	this.ajouterArrete = function(noeud1,noeud2,ponderation){
		
		if(ponderation === ""){
			ponderation = this.nouvelle_ponderation();
		}
		
		//On recupere les id des deux sommets
		var n1 = noeud1.getInfos()[5];
		var n2 = noeud2.getInfos()[5];
		var i1 = this.sommets.indexOf(n1);
		var i2 = this.sommets.indexOf(n2);
		
		if(this.matrice[i1][i2] == "inf"){
			this.aretes.push( new Arete(this.crayon,noeud1,noeud2,1,this.couleurs_arete,this.epaisseurs_arete,ponderation,1,0.5) );
		
			//on ajoute l'arete dans la matrice
			this.matrice[i1][i2] = ponderation;

			this.ponderations.push(ponderation);

			//Si il existait deja une arete entre ces deux sommts, les aretes ne doivent plus etre centrées
			if(this.matrice[i2][i1] != "inf"){
				var Naretes = this.aretes.length;
				this.aretes[Naretes-1].centrer = false;//On arrete de centrer l'arete qui vient d'etre cree

				for(var i = 0 ; i<Naretes ; i++){
					if(this.aretes[i].noeud1.getInfos()[5] == n2 && this.aretes[i].noeud2.getInfos()[5] == n1){
						//On vient de repere l'arete opposée
						this.aretes[i].centrer = false;
					}
				}
			}
		}

		else{
			//on va changer la ponderation et retracer l'arete
			this.matrice[i1][i2] = ponderation;

			var Naretes = this.aretes.length;
			for(var i = 0 ; i<Naretes ; i++){
				if(this.aretes[i].noeud1.getInfos()[5] == n2 && this.aretes[i].noeud2.getInfos()[5] == n1){
					//On vient de repere l'arete opposée
					this.aretes[i].nom = ponderation;
					this.ponderations[i] = ponderation;
					break;
				}
			}
		}

	}
	
	this.tracer = function(cadrillage,pasX,pasY){
		//le fond redevient blanc
		this.crayon.fillStyle = "white";
		
		this.crayon.fillRect(this.limites[0],this.limites[1],this.limites[2],this.limites[3]);	
		
		if(cadrillage){
			//On trace le cadriage
			this.crayon.strokeStyle = "blue";
			this.crayon.lineWidth = 1; 
			
			
			for(var i = Math.round(this.limites[0]+pasX/2); i<(this.limites[0]+this.limites[2]) ; i = i+pasX){
				this.crayon.beginPath();
				
				this.crayon.moveTo(i,this.limites[1]);
				this.crayon.lineTo(i,this.limites[1]+this.limites[3]);
				
				this.crayon.stroke();
			}
			
			for(var i = Math.round(this.limites[1]+pasY/2) ; i<this.limites[1]+this.limites[3] ;i=i+pasY){
				this.crayon.beginPath();
				
				this.crayon.moveTo(this.limites[0],i);
				this.crayon.lineTo(this.limites[0]+this.limites[2],i);
				
				this.crayon.stroke();
			}
		}
		else if(pasX > 0 && pasY > 0){
			this.crayon.strokeStyle = "blue";
			this.crayon.lineWidth = 1; 
			
			for(var i = Math.round(this.limites[0]+pasX/2); i<(this.limites[0]+this.limites[2]) ; i = i+pasX){
				for(var j = Math.round(this.limites[1]+pasY/2) ; j<this.limites[1]+this.limites[3] ;j = j+pasY){

					this.crayon.beginPath();
					this.crayon.arc(i, j, 1 , 0 , Math.PI*2 , true);
					this.crayon.stroke();
				}
			}
		}

		var n = this.noeuds.length;
		
		for(var i = 0; i<n ; i++){
			this.noeuds[i].tracer();
		}

		var n = this.aretes.length;
		for(var i = 0; i<n ; i++){
			if(!this.oriente){//Si le graphe n'est pas oriente, il faut faire attention aux doubles aretes

				if(this.aretes[i].centrer){//Si elle est encore centree, c'est qu'elle est unique
					this.aretes[i].tracer(this.pondere,this.oriente);
				}
				else{
					var n1 = this.aretes[i].noeud1.getInfos()[5];
					var n2 = this.aretes[i].noeud2.getInfos()[5];
					var i1 = this.sommets.indexOf(n1);
					var i2 = this.sommets.indexOf(n2);

					if(this.matrice[i1][i2] < this.matrice[i2][i1]){//On affiche seuelement la ponderation minimale
						this.aretes[i].tracer(this.pondere,this.oriente);
					}
				}

			}
			else{
				this.aretes[i].tracer(this.pondere,this.oriente);
			}
		}
		

	}

	this.update = function(){
		var N = this.aretes.length;
		for(var i = 0; i<N ; i++){
			this.aretes[i].update_coordonnes();
		}
	}

	this.get_voisins = function(id_sommet){
		var rep = [];
		var N = this.sommets.length;
		for(var j = 0 ; j < N ; j++){
			if(this.matrice[id_sommet][j] != "inf"){
				rep.push(j);
			}
		}
		return rep;

	}

	this.get_id_Sommet = function(nom){
		return this.sommets.indexOf(nom);
	}

	this.initialisation = function(){
		var N = this.aretes.length;
		for(var i = 0 ; i < N ; i++){
			this.aretes[i].ETAT = 0;
		}

		var N = this.noeuds.length;
		for(var i = 0 ; i < N ; i++){
			this.noeuds[i].ETAT = 0;
		}
	}
}