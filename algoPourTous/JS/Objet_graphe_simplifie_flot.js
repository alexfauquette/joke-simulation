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
	this.matrice_valeurs = [];
	this.sommets = [];
	this.ponderations = [];

	this.pondere = true;
	this.oriente = true;

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
		this.matrice_valeurs.push(new Array());
		for(var i = 0; i<taille-1;i++){
			if(taille > 1){
				//Si la matrice n'était pas vide
				this.matrice[i].push('inf');
				this.matrice_valeurs[i].push('inf');
			}
			this.matrice[taille-1].push('inf');
			this.matrice_valeurs[taille-1].push('inf');
		}
		this.matrice[taille-1].push('inf');
		this.matrice_valeurs[taille-1].push('inf');

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
			this.matrice_valeurs[i1][i2] = 0;

			this.ponderations.push(ponderation);

			//Si il existait deja une arete inverse entre ces deux sommets, les aretes ne doivent plus etre centrées
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

	this.get_voisins_accessibles = function(id_sommet){
		var rep = [];
		var N = this.sommets.length;
		for(var j = 0 ; j < N ; j++){
			if(this.matrice[id_sommet][j] != "inf" && this.matrice[id_sommet][j] > this.matrice_valeurs[id_sommet][j]){
				//cas où l'on peut aller suivant le sens direct
				rep.push(j);
			}
			if(this.matrice[j][id_sommet] != "inf" && this.matrice_valeurs[j][id_sommet] > 0){
				//cas où l'on peut remonter l'arete car elle a deja été remplie en partie
				rep.push(j);
			}
		}
		return rep;
	}

	this.get_arete = function(i1,i2){
		var N = this.aretes.length;
		for(var j = 0 ; j < N ; j++){
			if(this.aretes[j].noeud1 == this.noeuds[i1] && this.aretes[j].noeud2 == this.noeuds[i2]){
				return j;
			}
		}
		return -1;
	}

	this.set_valeur = function(i1,i2, val, tracer){
		//modifie la valeur de l'arete d'indice i comprise entre les sommets i1 et i2
		var i = this.get_arete(i1, i2);
		this.aretes[i].valeur = val;
		this.matrice_valeurs[i1][i2] = val;
		if(tracer){
			this.aretes[i].tracer(this.pondere,this.oriente);
		}
	}


	this.get_id_Sommet = function(nom){
		return this.sommets.indexOf(nom);
	}

	this.initialisation = function(){
		var N = this.aretes.length;
		for(var i = 0 ; i < N ; i++){
			this.aretes[i].ETAT = 0;
			this.aretes[i].valeur = 0;
		}

		var N = this.noeuds.length;
		for(var i = 0 ; i < N ; i++){
			this.noeuds[i].ETAT = 0;
			for(var j = 0 ; j < N ; j++){
				if(this.matrice_valeurs[i][j] != 'inf'){
					this.matrice_valeurs[i][j] = 0;
				}
			}
		}
	}

	this.get_chemin = function(debut, fin, profondeur){
		var mem = this.get_voisins_accessibles(debut);
		var chemin = [debut];
		var vues = [];
		var antecedant = [];
		var N = this.sommets.length;
		for(var i = 0 ; i < N ; i++){
			vues.push(false);
			antecedant.push(-1);
		}

		antecedant[debut] = debut;
		vues[debut] = true;

		//initialisation des antecedants
		var N = mem.length;
		for(var i = 0 ; i < N ; i++){
			antecedant[mem[i]] = debut;
		}
	

		while(chemin[chemin.length-1] != fin && mem.length>0){
			//alert(mem+" ; "+chemin);
			//on recupere un sommet possible
			if(profondeur){
				var s = mem.pop();
			}
			else{
				var s = mem.shift();
			}
			if(! vues[s]){//Si le sommet est nouveau. Sinon on ne fait rien, on continue juste à chercher
				vues[s] = true;

				chemin.push(s);

				var v = this.get_voisins_accessibles(s);

				while(v.length > 0){
					var x = v.pop();
					mem.push(x);
					//Attention a la gestion des antecedants
					if(! profondeur){
						//pour le parcourt en largeur
						if(antecedant[x] < 0){//Si il n'y a pas encore d'antecedant
							antecedant[x] = s;
						}
					}
					else{
						if(!vues[x]){
							antecedant[x] = s;
						}
					}
					
				}
			}		
		}

		if(chemin[chemin.length-1] == fin){
			chemin = [fin];
			while(chemin[chemin.length-1] != debut){
				chemin.push(antecedant[chemin[chemin.length-1]]);
			}
			chemin.reverse();

			return chemin;
		}
		else{
			return [];
		}
	}

	this.get_limitant = function(chemin){
		if(chemin.length <= 1){
			//ce n'est pas a proprement parler un chemin
			return [];
		}
		else{
			//initialisation
			if(this.matrice[chemin[0]][chemin[1]] != 'inf'){
				var limite = this.matrice[chemin[0]][chemin[1]]-this.matrice_valeurs[chemin[0]][chemin[1]];
				var s1 = chemin[0];
				var s2 = chemin[1];
			}
			else if(this.matrice[chemin[1]][chemin[0]] != 'inf'){
				var limite = this.matrice_valeurs[chemin[1]][chemin[0]];
				var s1 = chemin[1];
				var s2 = chemin[0];
			}

			var N = chemin.length;
			for(var i = 1 ; i < N-1 ; i++){
				if(this.matrice[chemin[i]][chemin[i+1]] != 'inf'){
					//arete en sens direct
					var l = this.matrice[chemin[i]][chemin[i+1]]-this.matrice_valeurs[chemin[i]][chemin[i+1]];
					if(l<limite){
						limite = l;
						var s1 = chemin[i];
						var s2 = chemin[i+1];
					}
				}
				else if(this.matrice[chemin[i+1]][chemin[i]] != 'inf'){
					//arete en sens invers
					var l = this.matrice_valeurs[chemin[i+1]][chemin[i]];
					if(l<limite){
						limite = l;
						var s2 = chemin[i];
						var s1 = chemin[i+1];
					}
				}
			}
			return [limite,s1,s2];
		}
	}

	this.remplir = function(chemin, tracer){
		var limite = this.get_limitant(chemin)[0];
		var N = chemin.length;
		for(var i = 0 ; i < N-1 ; i++){
			if(this.matrice[chemin[i]][chemin[i+1]] != 'inf'){
				//arete en sens direct

				var val = this.matrice_valeurs[chemin[i]][chemin[i+1]]+limite;
				this.set_valeur(chemin[i] , chemin[i+1], val, tracer);
			}
			else if(this.matrice[chemin[i+1]][chemin[i]] != 'inf'){
				//arete en sens invers
				var val = this.matrice_valeurs[chemin[i+1]][chemin[i]]-limite;
				this.set_valeur(chemin[i+1] , chemin[i], val, tracer);
			}

		}
	}
}

