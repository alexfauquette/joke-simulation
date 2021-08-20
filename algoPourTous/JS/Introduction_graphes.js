var can = document.getElementById("Canvas1");//pour afficher le graphe
var crayon = can.getContext("2d");

var can2 = document.getElementById("Canvas2");// pour afficher la matrice
var pinceau = can2.getContext("2d");

var can3 = document.getElementById("Canvas3");// pour afficher la matrice
var stylo = can3.getContext("2d");

var G = new Graphe(crayon,pinceau,stylo,[0,0,600,400]);


var date = new Date();
var x_clique = -1;
var y_clique = -1;
var clavier = "A";
var depart = 0;
var noeud;
var arete;
var x_noeud_initial;
var x_noeud_initial;
/*
var noeud_temporaire;
var arete_temporaire;
*/
var pasX = 60;
var pasY = 60;
var R = 20;

var rouge = false;

G.tracer(false,pasX,pasY);


// --------- Cas général (mouvement de la souris)


function souris_mouvement_1(e){
	var rect = can.getBoundingClientRect();//objet DOM qui correspond au rectangle entourant le canvas
    var x = (e.clientX - rect.left)*600/can.offsetWidth;
	var y = (e.clientY - rect.top)*400/can.offsetHeight;

	//var position = document.getElementById('position');

	if(rouge){
		G.tracer(false,pasX,pasY);
		rouge=false;
	}

	// Si il n'y a pas eu de clique, qu'il a eu lieu sur le vide ou sur un sommet
	if(depart == 0 || depart == 1 || depart == 2){
		
		//calcul de la distance par rapport au sommet le plus plroche
		var x1 = x-(x%pasX)+pasX/2;
		var y1 = y-(y%pasY)+pasY/2;
		var d = (x-x1)*(x-x1)+(y-y1)*(y-y1);
		
		//position.innerHTML = 'Position X : ' +  x + 'px<br />Position Y : ' + y + 'px d^2 : '+d + "<br />Clavier = "+clavier+" départ = "+depart;
		
		var deja_pris = false;


		if(clavier == "D"){


			if(depart == 2){
				var x = x-(x%pasX)+pasX/2;
				var y = y-(y%pasY)+pasY/2;

				var Nnoeuds = G.noeuds.length;
			
				var compteur = 0;
				for(var i=0 ; i<Nnoeuds ; i++){
					var n = G.noeuds[i];
					if(n.In(x,y)){
						compteur++;
						if(compteur == 2){
							deja_pris = true;
							noeud.bordures = [["red",2]];
							n.bordures = [["red",2]];
							noeud.x = x;
							noeud.y = y;
							G.update();
							G.tracer(false,pasX,pasY);
							noeud.bordures = [["blue",2]];
							n.bordures = [["blue",2]];
						}
					}
				}

				if(!deja_pris){
					//Si un sommet est en cours de déplacement
					noeud.bordures = [["green",2]];
					noeud.x = x;
					noeud.y = y;
					G.update();
					G.tracer(false,pasX,pasY);
					noeud.bordures = [["blue",2]];
				}
			}
			else if(depart == 0){

				G.tracer(false,pasX,pasY);
				var Nnoeuds = G.noeuds.length;
				for(var i=0 ; i<Nnoeuds ; i++){
					var n = G.noeuds[i];
					if(n.In(x,y)){

						n.bordures = [["green",2]];
						G.tracer(false,pasX,pasY);
						n.bordures = [["blue",2]];

					}
				}
			}
		}


		else if(d<R*R){
			//On et dans une zonne où il peut y avoir un sommet
			
			var Nnoeuds = G.noeuds.length;
			
			for(var i=0 ; i<Nnoeuds ; i++){
				var n = G.noeuds[i];
				if( n.In(x,y) ){
					deja_pris = true;

					//On chage la bordure de ce noeud en fonction de l'action en cours

					if(clavier == "S"){
						//suppression
						
						if(depart == 2 && n.getInfos()[5] == noeud.getInfos()[5]){
							//si c'est le noeud que l'on voulait supprimer
							n.bordures = [["red",2]];
							rouge = true;
						}

						if(depart ==0){
							//si c'est le noeud que l'on voulait supprimer
							n.bordures = [["red",2]];
							rouge = true;
						}
					}
					else{
						//ajout
						n.bordures = [["lightblue",2]];
						n.fonds[0] = "lightgray";						
					}

					G.tracer(false,pasX,pasY);

					n.bordures = [["blue",2]];
					n.fonds[0] = "white";
					break;
				}
			}	

			if( !deja_pris && clavier != "S"){
				//Si l'emplacement est libre et qu'on est pas sensé supprimer des éléments, on trace un crecle en bleu claire
				G.tracer(false,pasX,pasY);

				if(d<R*R){
					crayon.fillStyle = "white";
					crayon.beginPath();	
						
					crayon.lineWidth = 2;//epaisseur de la bordures
					crayon.strokeStyle = "lightblue";//couleur de la bordures
						
					crayon.arc(x1, y1, R , 0 , Math.PI*2 , true);
					crayon.fill();
					crayon.stroke();
				}
			}
		}
	}
	
	if(depart == 2 && (clavier=="A" || clavier=="")){
		//Si on vient d'un sommet, et qu'on est en position de tracer, on dessine en gris une arete
		G.tracer(false,pasX,pasY);
		info = noeud.getInfos();
		x1 = info[0];
		y1 = info[1];
		
		crayon.beginPath();
			
		crayon.strokeStyle = "gray";
		crayon.lineWidth = 2; 
			
		crayon.moveTo(x1,y1);
		crayon.lineTo(x,y);

		
		crayon.stroke();
		noeud.tracer();
	}


}


//---------------------------------------------------------------------------------------------------------------------------


//Cas du clique (le debut)
souris_down_1 =  function(e) {
	var rect = can.getBoundingClientRect();//objet DOM qui correspond au rectangle entourant le canvas
    x_clique = (e.clientX - rect.left)*600/can.offsetWidth;
	y_clique = (e.clientY - rect.top)*400/can.offsetHeight;


	depart = 1;// On suppose que le clique a lieu dans un espace libre
	

	// On teste cheque noeud deja existant, voir si on n'a pas cliqué sur ce noeud
	var Nnoeuds = G.noeuds.length;
	for(var i=0 ; i<Nnoeuds ; i++){
		var n = G.noeuds[i];
		if( n.In(x_clique,y_clique) ){
			//Si un noued a été trouvé
			noeud = n;

			if(clavier == "D"){
				//on retient d'où vien le noeud, au cas où il serrait laché a un endroit impossible
				x_noeud_initial = n.getInfos()[0] ;
				y_noeud_initial = n.getInfos()[1] ;
			}
			
			depart = 2;
			break;
		}
	}
	
	//Si on n'a pas trouvé de noeud lié au clique on cherche une arête
	if(depart == 1){
		
		var Naretes = G.aretes.length;
		for(var i = 0 ; i < Naretes ; i++){
			var a = G.aretes[i];
			if( a.In(x_clique,y_clique) ){
				arete = a;
				depart = 3;
				break;
			}
		}
	}

}



//---------------------------------------------------------------------------------------------------------------------------
//Cas du clique (la fin)
souris_up_1  = function(e) {

	// On recupère les coordonnées où le boutton de la souris à été relevé
    var rect = can.getBoundingClientRect();//objet DOM qui correspond au rectangle entourant le canvas
    var x = (e.clientX - rect.left)*600/can.offsetWidth;
	var y = (e.clientY - rect.top)*400/can.offsetHeight;


	if(clavier == "D"){
		var Nnoeuds = G.noeuds.length;
			
		var compteur = 0;
		for(var i=0 ; i<Nnoeuds ; i++){
			var n = G.noeuds[i];
			if(n.In(x,y)){
				compteur++;

				if(compteur == 2){
					noeud.x = x_noeud_initial;
					noeud.y = y_noeud_initial;
					G.update();
				}
			}
		}
	}

	// Si on avait cliqué enfoncé la touche S
	else if(clavier == "S" || clavier == "s"){
	
		if(depart == 2){//pour un noeud
		
			if(noeud.In(x,y)){//et que l'on est toujours sur le meme noeud

				var nom = noeud.getInfos()[5];
				var i = G.sommets.indexOf(nom);

				//suppression des arretes
				var k = 0;
				while( k < G.aretes.length ){
					var n1 = G.aretes[k].noeud1.getInfos()[5];
					var n2 = G.aretes[k].noeud2.getInfos()[5];
					if(n1 == nom || n2 == nom){
						G.ponderations.splice(G.ponderations.indexOf(G.aretes[k].nom),1);
						G.aretes.splice(k,1);//on le supprime
					}
					else{
						k = k + 1;
					}
				}

				//suppression du sommet
				G.noeuds.splice(i,1);
				G.sommets.splice(i,1);
				G.matrice.splice(i,1);
				for(var j = 0; j<G.matrice.length ; j++){
					G.matrice[j].splice(i,1);
				}
				G.tout_retracer();
				
			}
		}
		
		else if(depart == 3){

			if(arete.In(x,y)){
				
				var Naretes = G.aretes.length;
				for(var i = 0; i< Naretes ; i++){
					var info1 = arete.getInfos();
					var info2 = G.aretes[i].getInfos();
					if(info1[0] == info2[0] && info1[1] == info2[1] && info1[5] == info2[5]    &&     info1[6] == info2[6] && info1[7] == info2[7] && info1[11] == info2[11]){
						G.matrice[G.sommets.indexOf(arete.noeud1.nom)][G.sommets.indexOf(arete.noeud2.nom)] = "0";//suppression de l'arete dans la matrice
						G.ponderations.splice(G.ponderations.indexOf(G.aretes[i].nom),1);
						G.aretes.splice(i,1);//on le supprime

						//si l'arete faisiat parti d'une double arete, on centre l'autre
						if(G.matrice[G.sommets.indexOf(arete.noeud2.nom)][G.sommets.indexOf(arete.noeud1.nom)] != "0"){
							for(var j = 0 ; j < G.aretes.length ; j++){
								info =  G.aretes[j].getInfos();

								if(info[5] == arete.noeud2.nom && info[11] == arete.noeud1.nom){
									G.aretes[j].centrer = true;
									break;
								}
							}
						}

						G.tout_retracer();
						break;
					}
				}
			}
			
		}
		
		G.tracer(false,pasX,pasY);
		
	}
	
	else if(clavier == "A" || clavier == ""){
		if(depart == 1 ){//on devrait ajouter un sommet
		
			var x1 = x_clique-(x_clique%pasX)+pasX/2;
			var y1 = y_clique-(y_clique%pasY)+pasY/2;
			
			var dx = (x-x1);
			var dy = (y-y1);
			
			if( dx*dx+dy*dy < R*R){
				G.ajouterNoeud(x1,y1,R,R,"");
			}
		}
		
		else if(depart == 2){
			//On cherche le noeud où on s'est arrete
			
			var trouve = false;
			
			var Nnoeuds = G.noeuds.length;
			for(var i=0 ; i<Nnoeuds ; i++){
				var n = G.noeuds[i];
				if( n.In(x,y) ){
					
					noeud2 = n;
					trouve = true;
					break;
				}
			}
			
			if(trouve){
				var info1 = noeud.getInfos();
				var info2 = noeud2.getInfos();
				if( !(info1[0] == info2[0] && info1[1] == info2[1])){// Si ce n'est pas deux fois le meme noeud
					G.ajouterArrete(noeud,noeud2);
				}
			}
		}
	}
	
	G.tracer(false,pasX,pasY);
	
	x_clique = -1;
	y_clique = -1;

	depart = 0;
	noeud = 0;
	
}


//---------------------------------------------------------------------------------------------------------------------------
//Cas du clavier (touche pressée)

touches_clavier1 = function(e) {
	
	if(x_clique == -1){//il faut appuyer avant de commencer à cliquer (empéche de changer d'avis entre deux)
		var entree_clavier = String.fromCharCode( e.keyCode ).toUpperCase(); 
		if(entree_clavier =="S"){
			var form = document.getElementById("etat");
			form.add.style.backgroundColor = "";
			form.dep.style.backgroundColor = "";
			form.supp.style.backgroundColor = "lightblue";
			clavier = "S";
		}
		else if(entree_clavier =="D"){
			var form = document.getElementById("etat");
			form.add.style.backgroundColor = "";
			form.dep.style.backgroundColor = "lightblue";
			form.supp.style.backgroundColor = "";
			clavier = "D";
		}
		else if(entree_clavier=="A"){
			var form = document.getElementById("etat");
			form.add.style.backgroundColor = "lightblue";
			form.dep.style.backgroundColor = "";
			form.supp.style.backgroundColor = "";
			clavier = "A";
		}
	}
}



can.addEventListener('mousedown',souris_down_1, false);
can.addEventListener('mousemove', souris_mouvement_1, false);
can.addEventListener('mouseup',souris_up_1, false);
document.addEventListener('keydown',touches_clavier1, false);


modifierR = function(){
	R = Number(document.forms.reglages.rayon.value);
	var Nnoeuds = G.noeuds.length;
	for(var i = 0; i<Nnoeuds ; i++){
		var n = G.noeuds[i];
		n.dx = R;
	}
	var Naretes = G.aretes.length;
	for(var i =0; i<Naretes ; i++){
		G.aretes[i].update_coordonnes();
	}
	G.tracer(false,pasX,pasY);
}

modifier_pas = function(){
	pasX = Number(document.forms.reglages.pas_horiz.value);
	pasY = Number(document.forms.reglages.pas_verti.value);
	
	G.tracer(false,pasX,pasY);
}

modifier_pas();
modifierR();




orienter_graphe = function(){
	if(!G.oriente){
		G.oriente = true;
		G.tracer(false,pasX,pasY);

		G.tout_retracer();//retrace les deux représentatiosn associées
	}
}

desorienter_graphe = function(){
	if(G.oriente){
		G.oriente = false;
		G.tracer(false,pasX,pasY);

		G.tout_retracer();//retrace les deux représentatiosn associées
	}
}

ponderer = function(){
	if(!G.pondere){
		G.pondere = true;
		G.tracer(false,pasX,pasY);

		G.tout_retracer(); 
	}
	
}

deponderer = function(){
	if(G.pondere){
		G.pondere = false;
		G.tracer(false,pasX,pasY);

		G.tout_retracer(); 
	}
}

representer_matrice = function(){
	if(G.representation == "liste"){
		G.representation = "matrice";

		G.tout_retracer(); 
	}
}


representer_liste = function(){
	if(G.representation == "matrice"){
		G.representation = "liste";

		G.tout_retracer(); 
	}

}

representer_SA = function(){
	if(G.repres_math == "SAP"){
		G.repres_math = "SA";

		G.tout_retracer(); 
	}
}

representer_SAP = function(){
	if(G.repres_math == "SA"){
		G.repres_math = "SAP";

		G.tout_retracer(); 
	}
}

ajouter = function(form){
	if(clavier!= "A"){
		/*
		form.add.style.backgroundColor = "lightblue";
		form.dep.style.backgroundColor = "";
		form.supp.style.backgroundColor = "";*/
		clavier = "A";
	}
}

deplacer = function(form){
	if(clavier != "D"){
		/*
		form.dep.style.backgroundColor = "lightblue";
		form.supp.style.backgroundColor = "";
		form.add.style.backgroundColor = "";*/
		clavier = "D";
	}
}

supprimer = function(form){
	if(clavier != "S"){
		/*
		form.supp.style.backgroundColor = "lightblue";
		form.dep.style.backgroundColor = "";
		form.add.style.backgroundColor = "";*/
		clavier = "S";
	}
}
//---------------------------------------------------------------------------------------------------------------------------
//La sortie du canvas n'est pas gérée