//l'ojet fonctionne 
//retravailler l'esthetique
//	-quand on déplie, le element s'arretent des qu'ils sont à leur place (eviter qu'ils fassent un aller retour)
//	-ne pas ganger les delta d'un coup, les gerer avec des nombres à virgules (-1.5 immplique la moitier est à -1, et l'autre moitier à -2)
function Pile(liste_init, x0, y0, dx, dy, horientation, h, w, couleurF, couleurT, id_canvas){
	
	this.liste = liste_init;

	if(horientation=="vertical"){
		//coordonnees initiales
		this.x0 = x0;
		this.y0 = y0+h;
		//tailles où on peut écrire
		this.dx = dx;
		this.dy = dy-h;
	}
	else{
		//coordonnees initiales
		this.x0 = x0+w;
		this.y0 = y0;
		//tailles où on peut écrire
		this.dx = dx-w;
		this.dy = dy;
	}
	this.horientation = horientation;
	//taillle de cases (height, wigth)
	this.h = h;
	this.w = w;
	this.pinceau = document.getElementById(id_canvas).getContext("2d");

	this.couleurF = couleurF//Couleu de fond
	this.couleurT = couleurT//couleur du texte

	this.animationEnCours = false;
	this.delta_init = 5;

	this.delta = function(N,decalage){
		rep = this.delta_init;
		if(this.horientation == "vertical"){
			//on reduit le delta tant qu'on manque de place pour afficher N elements de la liste
			while(this.h + (N-1)*(this.h+rep) > this.dy-decalage && rep >= -this.h+this.delta_init){
				rep = rep - 1;
			}
			return rep;
		}
		else{
			//on reduit le delta tant qu'on manque de place pour afficher N elements de la liste
			while(this.w + (N-1)*(this.w+rep) > this.dx-decalage && rep >= -this.w+this.delta_init){
				rep = rep - 1;
			}
			return rep;
		}
	}

	this.nettoyer = function(){
		this.pinceau.beginPath();
		this.pinceau.fillStyle = "white";
		if(this.horientation == "vertical"){
			this.pinceau.rect(this.x0-2, this.y0-2-this.h, this.dx+4, this.dy+4+this.h);
		}
		else{
			this.pinceau.rect(this.x0-2-this.w, this.y0-2, this.dx+4+this.w, this.dy+4);
		}
		this.pinceau.fill();
	}

	this.tracer_element = function(txt, x, y){

		this.pinceau.beginPath();
		this.pinceau.lineWidth = 1;
		this.pinceau.strokeStyle = "black";
		this.pinceau.fillStyle = this.couleurF;
		this.pinceau.rect(x, y, this.w, this.h);
		this.pinceau.fill();	
		this.pinceau.stroke();


		this.pinceau.fillStyle = this.couleurT;
		//On recherche la bonne police
		var police = 20;
		this.pinceau.font = police+'pt Calibri';
				
		while(this.pinceau.measureText(txt).width > w-2 || parseInt(this.pinceau.font) > h-2){//tant que le texte ne rentre pas
			police = police-1;
			this.pinceau.font = police+'pt Calibri';
		}

		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
			
		this.pinceau.fillText(txt, x+w/2, y+h/2);

	}

	this.tracer_cadre = function(){
		this.pinceau.beginPath();
		this.pinceau.lineWidth = 3;
		this.pinceau.strokeStyle = "red";
		if(this.horientation == "vertical"){
			this.pinceau.strokeRect(this.x0, this.y0, this.w, this.h);	
		}
		else{
			this.pinceau.strokeRect(this.x0, this.y0, this.w, this.h);	
		}
		

	}

	this.tracer_liste = function(delta1,N,nettoyer,decalage,fin){
		if(nettoyer){
			this.nettoyer();
		}

		if(this.horientation == "vertical" && N>0){
			//L'ecart entre les bloques est donne par this.delta(N)
			var delta = Math.min(delta1,this.delta(N,decalage));
			
			
			//Si y en a vraiment trop d'elements, on supprime les derniers
			while(this.h + (N-1)*(this.h+delta) > this.dy-decalage){
				N = N-1;
			}

			var y = this.y0 + decalage + (N-1)*(this.h+delta);//coordonnee du dernier element (celui tout en bas)

			//On les trace de bas en haut
			for(var i = fin-N ; i<fin ; i++){
				this.tracer_element(this.liste[i], this.x0, y);
				y = y - this.h - delta;
			}


		}
		else if(N>0){
			//L'ecart entre les bloques est donne par this.delta(N)
			var delta = Math.min(delta1,this.delta(N,decalage));

			//Si y en a vraiment trop d'elements, on supprime les derniers
			while(this.w + (N-1)*(this.w+delta) > this.dx-decalage){
				N = N-1;
			}

			var x = this.x0 + decalage + (N-1)*(this.w+delta);//coordonnee du dernier element (celui tout à droite)

			//On les trace de droite à gauche
			for(var i = fin-N ; i<fin ; i++){
				this.tracer_element(this.liste[i], x, this.y0);
				x = x - this.w - delta;
			}

		}

		this.tracer_cadre();
	}

	this.tracer = function(){
		var N = this.liste.length;
		this.tracer_liste(this.delta(N),N,true,0,N);
	}

	this.ajouter = function(txt, animation, afficher){
		this.animationEnCours = false;
		this.liste.push(txt);
		var N = this.liste.length;
		if(animation && afficher){
			var delta1 = this.delta(N-1,0);
			var delta2 = this.delta(N,0);

			

			if(this.horientation == "vertical"){
				while(this.h + (N-1)*(this.h+delta2) > this.dy){
					N = N-1;
				}
			}
			else{
				while(this.w + (N-1)*(this.w+delta2) > this.dx){
					N = N-1;
				}
			}
			
			var obj = this;
			setTimeout(function(){
				obj.animationEnCours = true;
				obj.animation_ajout(delta1,delta2,N,20);}
				,50);

		}
		else if(afficher){
			this.tracer_liste(this.delta(N),N,true,0,N);
		}
	}

	this.animation_ajout = function(d1,d2,N2,iteration){
		var N = this.liste.length;

		if(this.animationEnCours && iteration>0){
			
			if(this.horientation == "vertical"){

				var y = this.y0 + (this.h)/20*(20-iteration);

				this.tracer_liste(d1,N-1,true,Math.max(0,Math.min(y-this.y0+d1,this.h+d2)) ,N-1);//On trace les bloques deja existans en forcant leur ecart à d1 (qui est inferieur ou egale a ce qu'il devrait etre)

				this.tracer_element(this.liste[N-1],this.x0,y-this.h);
				
			}
			else{

				var x = this.x0 + (this.w)/20*(20-iteration);

				this.tracer_liste(d1,N-1,true,Math.max(0,Math.min(x-this.x0+d1,this.w+d2)) , N-1);//On trace les bloques deja existans en forcant leur ecart à d1 (qui est inferieur ou egale a ce qu'il devrait etre)

				this.tracer_element(this.liste[N-1],x-this.w,this.y0);
			}

			this.tracer_cadre();

			
			var obj = this;
			if(d1>d2){
				setTimeout(function(){obj.animation_ajout(Math.round(d1-(d1-d2)/iteration),d2,N2,iteration-1)},50);
			}
			else{
				setTimeout(function(){obj.animation_ajout(d1,d2,N2,iteration-1)},50);
			}
				
		}
	}


	this.recuperer = function(animation,afficher){
		this.animationEnCours = false;
		var N = this.liste.length;

		if(animation && afficher && N>=1){
			var obj = this;
			rep = this.liste[N-1];
			
			this.liste.splice(N-1,1);
			setTimeout(function(){
				obj.animationEnCours = true;
				obj.animation_recuperer(20);}
				,50);
			return rep;
		}
		else{
			reponse = this.liste[N-1];
			this.liste.splice(N-1,1);
			if(afficher){
				this.tracer_liste(this.delta(N),N-1,true,0,N-1);
			}
			return reponse;
		}
	}

	this.animation_recuperer = function(iteration){
		N = this.liste.length;
		if(this.animationEnCours && iteration>0){

			if(this.orientation == "vertical"){
				this.tracer_liste(this.delta(N),N,true,this.w*iteration/20,N);
			}
			else{
				this.tracer_liste(this.delta(N),N,true,this.h*iteration/20,N);
			}
			
			var obj = this;

			setTimeout(function(){
				obj.animation_recuperer(iteration-1);}
				,50);
		}
	}
}


