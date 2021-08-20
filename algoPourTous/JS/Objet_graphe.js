var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];



function Graphe(crayon,pinceau,stylo,limites) {
	//limites contient [x,y,largeur,hauteru] a respecter pour le canevas
	this.noeuds = [];
	this.aretes = [];
	this.crayon = crayon;
	this.pinceau = pinceau;
	this.stylo = stylo;
	this.limites = limites;

	this.matrice = [];
	this.sommets = [];
	this.ponderations = [];

	this.pondere = true;
	this.oriente = false;
	this.representation = "liste";
	this.repres_math = "SAP";

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

	this.ajouterNoeud = function(x,y,dx,dy,nom){

		var dx = dx;
		var dy = dy;
		var type = "Cercle";
		var bordures = [["blue",2]];
		var fonds = ["white"];
		var couleursTexte = ["black"];

		nom = this.nouveau_nom();//On choisit un nom au sommet

		this.noeuds.push( new Noeud(this.crayon, x, y, dx, dy, nom, type, bordures, fonds, couleursTexte) );
		this.sommets.push(nom);

		var taille = this.matrice.length + 1;
		this.matrice.push(new Array());
		for(var i = 0; i<taille-1;i++){
			if(taille > 1){
				//Si la matrice n'était pas vide
				this.matrice[i].push('0');
			}
			this.matrice[taille-1].push('0');
		}
		this.matrice[taille-1].push('0');

		this.tout_retracer();

	}
	
	this.ajouterArrete = function(noeud1,noeud2){
		
		ponderation = this.nouvelle_ponderation();

		this.aretes.push( new Arete(this.crayon,noeud1,noeud2,1,["black"],[3],ponderation,1,0.5) );

		//On recupere les id des deux sommets
		var n1 = noeud1.getInfos()[5];
		var n2 = noeud2.getInfos()[5];
		var i1 = this.sommets.indexOf(n1);
		var i2 = this.sommets.indexOf(n2);
		
		//on ajoute le sommet dans la matrice
		this.matrice[i1][i2] = ponderation;

		this.ponderations.push(ponderation);

		if(this.matrice[i2][i1] != "0"){
			var Naretes = this.aretes.length
			this.aretes[Naretes-1].centrer = false;//On arrete de centrer l'arete qui vient d'etre cree 
			for(var i = 0 ; i<Naretes ; i++){
				if(this.aretes[i].noeud1.getInfos()[5] == n2 && this.aretes[i].noeud2.getInfos()[5] == n1){
					//On vient de repere l'arete opposée
					this.aretes[i].centrer = false;
				}
			}
		}
		
		this.tout_retracer();
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
		else{
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
		
		var n = this.noeuds.length;
		
		for(var i = 0; i<n ; i++){
			this.noeuds[i].tracer();
		}

		

	}

	this.update = function(){
		var N = this.aretes.length;
		for(var i = 0; i<N ; i++){
			this.aretes[i].update_coordonnes();
		}
	}


	this.tracer_matrice = function(pinceau,mat,x0,y0,dx,dy){
		pinceau.fillStyle = "white";
		pinceau.fillRect(x0-3,y0-3,x0+dx,y0+dx);

		var taille= 25;//mettre une taille de plus


		//on initialise les variables pour etre sur de rentrer dans la boucle
		var mesure_dx = dx+2;
		var mesure_dy = dy+2;


		N = mat.length;

		dist_min = 6 * N;//taille utilisée pour les lignes et une marge de 1px de chaque cote

		
		while(mesure_dy > dy || mesure_dx > dx && taille>2){//tant qu'on peut pas faire rentrer tout ca dans un tableau

			//On diminue la taille et on remet à 0 les tailles mesurées
			taille = taille-1;
			pinceau.font = taille+"pt Verdana";

			mesure_dx = dist_min;
			mesure_dy = dist_min;


			max_ligne = Math.round(1.1*parseInt(pinceau.font));//bidouillage pour avoire une estimation de la hauteur

			max_colonne = 0;
			for(var i =0 ; i< N ; i++){
				//on va traiter ensemble la ieme ligne et la ieme colonne
				
				for(var j = 0 ; j < N ; j++){
					//largeure du j eme element de la i eme colonne
					if(pinceau.measureText(""+mat[j][i]).width > max_colonne){
						max_colonne = pinceau.measureText(mat[j][i]).width;
					}
				}

			}
			mesure_dy = mesure_dy + N*max_ligne;
			mesure_dx = mesure_dx + N*max_colonne;

		}
		// maintenant, on a les distance des lignes et des colonnes, et la taille pour le pinceau
		//On commence par tracer le texte

		
		var x;
		var y;
		var ecartX;
		var ecartY;

		pinceau.fillStyle = "black";
		pinceau.strokeStyle = "black";
		pinceau.lineWidth = 2; 
		pinceau.textAlign = "center";


		x = x0+3;
		for(var i=0 ; i<N ; i++){

			if(i>0){
				//Si ce n'est pas la première ligne, la valeur de y est encore à son max. On en proffite pour tracer le trait vertical
				pinceau.beginPath();
				pinceau.moveTo(x -3, y0);
				pinceau.lineTo(x -3, y - parseInt(pinceau.font));
				pinceau.stroke();
			}

			y = y0+3+parseInt(pinceau.font);// initialisation de y

			for(var j=0 ; j<N ; j++){//Pour chaque element de la colonne i et ligne j

				var text = ""+mat[j][i];//on prend l'élment correspondant

				ecartX = Math.round( max_colonne/2 );//On centre l'element sur sa colonne

				pinceau.textBaseline="alphabetic";
				if(i>0 && j>0){
					//Si il ne s'agit pas de nom d'un sommet
					if(text == "0"){
						pinceau.fillStyle = "red";
						if(!this.pondere){
							text = "0";
						}
					}
					else{
						pinceau.fillStyle = "green";
						if(!this.pondere){
							text = "1";
						}
					}
				}
				pinceau.fillText(text,x+ecartX,y);//On ecrit le texte
				pinceau.fillStyle = "black";

				y = y + 6 + max_ligne;//on passe à la ligne suivante 
			}

			//apres un ligne
			x = x + 6 + max_colonne;
			
		}
		//on a tout ecrit reste faire les lignes horizontales
		y = y0+3+ parseInt(pinceau.font);
		for( var j=0; j<N-1; j++){

			pinceau.beginPath();
			pinceau.moveTo(x0-3 , y+3);
			pinceau.lineTo(x , y+3);
			pinceau.stroke();
			y = y + 6 + max_ligne;
		}

	}



	this.tracer_matrice_adjacence = function(){

		var mat = [[""]];
		var N = this.matrice.length;

		for(var i = 0 ; i <N ; i++){
			mat[0].push(this.sommets[i]);//On complete petite a petit la ligne d'entre
			mat.push([this.sommets[i]]);//On place l'entre de la premiere ligbe de donnee

			//puis on la remplie
			for(var j = 0 ; j < N ; j++){
				mat[i+1].push(this.matrice[i][j]);
			}
		}

		if(!this.oriente){
			//On se fixe la convention suivante : 
			//Si il y a deux arêtes pour une paire de sommet, on prend celle de ponderation minimale
			for(var i = 1 ; i<N+1 ; i++){
				for(var j = 1 ; j < N+1 ; j++){
					if(mat[i][j] != "0" && mat[j][i] == "0"){
						mat[j][i] = mat[i][j];//Pas de probleme, il n' y qu'un arrete
					}
					else if(mat[i][j] != "0" && mat[j][i] != "0"){
						mat[j][i] = Math.min(mat[i][j],mat[j][i]);
					}
				}
			} 
		}

		this.tracer_matrice(this.pinceau,mat,10,10,400,400);
	}

	this.tracer_representation_mathematique = function(stylo,type){//type = "SA"|"SAP"
		//trace dans stylo le texte de la représentation mathématique du graphe
		document.getElementById('Canvas3').style.height = document.getElementById('Canvas3').offsetWidth/20+"px";

		document.getElementById('Canvas3').height = 50;
		stylo.fillStyle = "white";
		stylo.fillRect(0,0,1000,100);	

		stylo.fillStyle = "black";
		stylo.font = "16pt Verdana";
		if(type == "SA"){
			var texte_intro = "G = (S,A) = ( ";
		}
		else if(type == "SAP"){
			var texte_intro = "G = (S,A,P) = ( ";
		}
		

		var texte_sommets = "(";

		Nsommets = this.sommets.length;
		for(var i = 0 ; i<Nsommets-1 ; i++){
			texte_sommets = texte_sommets + this.sommets[i]+", ";
		}
		texte_sommets = texte_sommets + this.sommets[Nsommets-1] + ")";


		var texte_aretes = "{";

		//On fait la liste des sommets
		var debut = true;
		var ajout;
		for(var i = 0 ; i < Nsommets ; i++){
			for(var j = 0 ; j < Nsommets ; j++){
				if(this.matrice[i][j] != "0"){

					

					if(this.oriente){//Si le graphe est oriente, on ne se pose pas de question, on met tout
						//On gere le cas de la virgule a ne pas mettre ni au tout debut, ni a la fin
						if(!debut){
							ajout = ";";
						}
						else{
							ajout = "";
							debut = false;
						}

						//Si on a pas de ponderation, ou quelles sont de la forme S,A,P
						if(type == "SAP" || !this.pondere){
							texte_aretes = texte_aretes + ajout + "("+this.sommets[i]+","+this.sommets[j]+")";
						}

						//Si il faut mettre les ponderations
						else{
							texte_aretes = texte_aretes + ajout + "("+this.sommets[i]+","+this.matrice[i][j]+","+this.sommets[j]+")";
						}
					}
					else{//si il n'est pas orienté, il va faloir se poser des questions

						if(this.matrice[j][i] == "0" || this.matrice[j][i] > this.matrice[i][j]){//Si c'est la seule arete entre les deux, ou celle de ponderation minimale

							//On gere le cas de la virgule a ne pas mettre ni au tout debut, ni a la fin
							if(!debut){
								ajout = ";";
							}
							else{
								ajout = "";
								debut = false;
							}
							//Si on a pas de ponderation, ou quelles sont de la forme S,A,P
							if(type == "SAP" || !this.pondere){
								texte_aretes = texte_aretes + ajout + "("+this.sommets[i]+","+this.sommets[j]+")";
							}

							//Si il faut mettre les ponderations
							else{
								texte_aretes = texte_aretes + ajout + "("+this.sommets[i]+","+this.matrice[i][j]+","+this.sommets[j]+")";
							}
						}
						
					}
					
				}
			}
		}
		texte_aretes = texte_aretes + "}";



		var texte_ponderation = "";
		if(type == "SAP" && this.pondere){
			debut = true;
			texte_ponderation = texte_ponderation + "(";
			for(var i = 0 ; i<Nsommets ; i++){
				for(var j = 0 ; j < Nsommets ; j++){
					if(this.matrice[i][j] != "0"){
						
						if(this.oriente){
							//gestion du debut
							if(!debut){
								ajout = ", ";
							}
							else{
								ajout = "";
								debut = false;
							}
							//........................
							texte_ponderation = texte_ponderation + ajout + this.matrice[i][j];
						}
						else if(this.matrice[j][i] == "0" || this.matrice[j][i] > this.matrice[i][j]){
							//gestion du debut
							if(!debut){
								ajout = ", ";
							}
							else{
								ajout = "";
								debut = false;
							}
							//........................
							texte_ponderation = texte_ponderation + ajout + this.matrice[i][j];
						}
					}
				}
			}
			texte_ponderation = texte_ponderation + ")";
		}

		stylo.fillStyle = "black";
		for(var taille = 16; taille >13 ; taille--){
			stylo.font = taille+"pt Verdana";

			if(texte_ponderation == ""){
				texte = texte_intro+texte_sommets+", "+texte_aretes+" )";
			}
			else{
				texte = texte_intro+texte_sommets+", "+texte_aretes+", "+texte_ponderation+" )";
			}

			longueur = stylo.measureText(texte).width;
			if(longueur < 990){
				
				stylo.fillStyle = "black";
				stylo.textAlign = "left";
				stylo.fillText(texte,10,28);
				break;
			}
		}

		if(longueur >= 990){

			document.getElementById('Canvas3').style.height = document.getElementById('Canvas3').offsetWidth/10+"px";

			document.getElementById('Canvas3').height = 100;

			//Si on peut pas l'afficher sur une seule ligne
			for(var taille = 16 ; taille > 8 ; taille--){
				stylo.font = taille+"pt Verdana";
				if(texte_ponderation == ""){
					texte = texte_intro+texte_sommets+",\n"+texte_aretes+" )";
				}
				else{
					texte = texte_intro+texte_sommets+",\n"+texte_aretes+",\n"+texte_ponderation+" )";
				}
				longueur = Math.max(stylo.measureText(texte_aretes).width , Math.max(stylo.measureText(texte_intro+texte_sommets+",").width,stylo.measureText(texte_ponderation+" )").width));

				if(longueur < 970){
					stylo.fillStyle = "black";
					stylo.textAlign = "left";
					stylo.fillText(texte_intro+texte_sommets+",",10,24);

					if(texte_ponderation==""){
						stylo.fillText(texte_aretes+" )",30,54);
					}
					else{
						stylo.fillText(texte_aretes+",",30,54);
						stylo.fillText(texte_ponderation+" )",30,84);
					}
					break;
				}
 
			}
		}

		if(longueur >= 990){
			stylo.font = "18pt Verdana";
			stylo.fillStyle = "black";
			stylo.textAlign = "left";
			stylo.fillText("Vous abusez là ! Il y a trop d'informations pour tout afficher",20,20);
		}


	}

	this.liste_adjacence = function(){
		//revoi la liste d'adjacence
		var rep = [];
		var Nsommets = this.sommets.length;

		for(var i = 0 ; i<Nsommets ; i++){
			rep.push([this.sommets[i]]);

			for(var j = 0 ; j<Nsommets ; j++){
				if(this.oriente){
					if(this.matrice[i][j] != "0"){//Si il y a une arete allant de i vers j
						if(this.pondere){
							rep[i].push("("+this.sommets[j] +","+ this.matrice[i][j]+")");//on ajoute la liste ce qu'il faudra écrire
						}
						else{
							rep[i].push(this.sommets[j]);
						}
					}
				}
				else{
					if(this.pondere){
						if(this.matrice[i][j] != "0" && this.matrice[j][i] != "0"){//Si il y a deux aretes declarees, la convention veut qu'on prenne le minimum des deux
							rep[i].push( "("+this.sommets[j] +","+ Math.min( this.matrice[i][j], this.matrice[j][i]) + ")");
						}
						else if(this.matrice[i][j] != "0"){
							rep[i].push( "("+this.sommets[j] +","+ this.matrice[i][j] + ")");
						}
						else if(this.matrice[j][i] != "0"){
							rep[i].push( "("+this.sommets[j] +","+ this.matrice[j][i] + ")");
						}
					}
					else{
						if(this.matrice[i][j] != "0"  || this.matrice[j][i] != "0"){
							rep[i].push(this.sommets[j]);
						}
					}
				}
			}
		}

		return rep;
	}

	this.tracer_liste_adjacence = function(pinceau,x0,y0,dx,dy){
		pinceau.fillStyle = "white";
		pinceau.fillRect(x0-10,y0-10,dx+20,dy+20);

		var liste = this.liste_adjacence();

		var taille= 25;
		pinceau.font = taille+"pt Verdana";
		pinceau.fillStyle = "black";
		pinceau.strokeStyle = "black";
		

		var N = liste.length;

		while((1.4*parseInt(pinceau.font) + 6)*N+5 > dy){//On s'assure que ça rentre verticalement
			taille = taille-1;
			pinceau.font = taille+"pt Verdana";
		}

		var max_large = 0
		var largeure_max_sommet = 0;

		while((max_large == 0 || max_large>dx) && taille >3){//Tant que l'on est trop large avec une protection contre les boucles infini
			max_large = 0;
			pinceau.font = taille+"pt Verdana";

			for(var i = 0 ; i < N ; i++){//Pour chaque element

				var large = 0;
				var M = liste[i].length;

				for(var j = 0 ; j < M ; j++){
					if(j==0){
						large  = large + pinceau.measureText(liste[i][0]).width + 36;//taille de la case plus les 10px de la fleche
						if(pinceau.measureText(liste[i][0]).width > largeure_max_sommet){
							largeure_max_sommet = pinceau.measureText(liste[i][0]).width;
						}
					}
					else{
						large = large + pinceau.measureText(liste[i][j]).width + 6;//taille de la case avec une petite marge
					}
				}
				if(large > max_large){
					max_large = large;
				}
			}
			taille = taille-1;//Si on retourne dans la boucle, la taille serra bien modifiée. Mais si on y retroune pas, cela n'aura pas d'impacte, car on defini la taille du pinceau au debut de la boucle seulement
			
		}

		//On passe a la partie dessin maintenant

		hauteur = 1.4*parseInt(pinceau.font);
		var x;

		pinceau.textAlign="center";
		pinceau.textBaseline="middle";

		for(var i = 0 ; i < N ; i++){

			pinceau.font = taille+"pt Verdana";
			pinceau.beginPath();
			pinceau.rect(x0, y0+i*(hauteur+6), largeure_max_sommet+6, hauteur+6);
			pinceau.stroke();

			pinceau.fillText(liste[i][0], x0+largeure_max_sommet/2+3,y0+(i+0.5)*(hauteur+6));

			var M = liste[i].length;
			x = x0 + largeure_max_sommet + 36;
			y = y0+i*(hauteur+6);
			for(var j = 1 ; j < M ; j++){
				var largeur = pinceau.measureText(liste[i][j]).width;

				pinceau.beginPath();
				pinceau.rect(x, y+2, largeur+6, hauteur+2);
				pinceau.stroke();

				pinceau.fillText(liste[i][j],x+largeur/2+3,y+2+hauteur/2);

				x = x + largeur+6;
			}
		}
		
	}

	this.tout_retracer = function(){
		if(this.representation == "matrice"){
			this.tracer_matrice_adjacence();
		}
		else if(this.representation == "liste"){
			this.tracer_liste_adjacence(this.pinceau,10,10,390,390);
		}
		this.tracer_representation_mathematique(this.stylo,this.repres_math);
	}

}
